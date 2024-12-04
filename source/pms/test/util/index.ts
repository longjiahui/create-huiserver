import {
  signCookie,
  startTestApplication,
  type Response,
} from "@anfo/huiserver"
import * as mods from "../../src/http"
import { agent as createAgent } from "supertest"
import { prisma } from "../../src/db"
import { signUser } from "../../src/service/jwt"
import { randomUUID } from "crypto"
import { urls } from "../../src/const"
import * as otherMods from "../../src/otherMods"
import * as serviceMods from "../../src/service"
import {
  APIInstance,
  GetAPIPathParameters,
  type GetAPIReq,
  type GetAPIRes,
} from "../../src/protocol"
import type TestAgent from "supertest/lib/agent"
import type Test from "supertest/lib/test"

const anonymousUserEmailSuffix = "@__for_test.com"

export type Agent = TestAgent<Test>

export function createAPI<T extends APIInstance>(agent: Agent, api: T) {
  return async (...rest: [...GetAPIPathParameters<T>, GetAPIReq<T>]) => {
    const data = (
      await agent
        .post(
          api.path(
            ...(api.path.length > 0
              ? rest.slice(0, api.path.length)
              : ([] as any[]))
          )
        )
        .send(rest.slice(-1)?.[0] as any)
        .expect(200)
    ).body as Response
    expect(data.code).toBe(0)
    return data.data as GetAPIRes<T>
  }
}

export function getTestAgent(
  options: {
    anonymous?: boolean
  } = {}
) {
  const { anonymous } = Object.assign(
    {
      anonymous: true,
    } satisfies typeof options,
    options
  )
  return startTestApplication().then(async (app) => {
    // load all mods
    await Promise.all(Object.values(otherMods).map((m) => app.use(m)))
    await Promise.all(Object.values(serviceMods).map((m) => app.use(m)))
    await Promise.all(Object.values(mods).map((m) => app.use(m)))
    const agent = createAgent(app.httpServer)
    const utils = {
      ...Object.keys(urls).reduce((t, k) => {
        t[k as keyof typeof t] = createAPI(
          agent,
          urls[k as keyof typeof urls]
        ) as any
        return t
      }, {} as { [k in keyof typeof urls]: ReturnType<typeof createAPI<(typeof urls)[k]>> }),
    }
    if (anonymous) {
      agent.set(
        "Cookie",
        `token=${signCookie(signUser(await getAnonymousUser()))}`
      )
    }
    return Object.assign(agent, utils) as TestAgent<Test> & typeof utils
  })
}

export async function cleanAnonymousUser() {
  return prisma.user.deleteMany({
    where: {
      email: {
        endsWith: anonymousUserEmailSuffix,
      },
    },
  })
}
export async function getAnonymousUser() {
  return prisma.user.create({
    data: {
      email: `${randomUUID()}${anonymousUserEmailSuffix}`,
    },
  })
}
