import { signCookie, startTestApplication } from "@anfo/huiserver"
import * as mods from "../../src/http"
import { agent } from "supertest"
import { prisma } from "../../src/db"
import { signUser } from "../../src/service/jwt"
import { randomUUID } from "crypto"

const anonymousUserEmailSuffix = "@__for_test.com"

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
    await Promise.all(Object.values(mods).map((m) => app.use(m)))
    const ret = agent(app.httpServer)
    if (anonymous) {
      ret.set(
        "Cookie",
        `token=${signCookie(signUser(await getAnonymousUser()))}`
      )
    }
    return ret
  })
}
export type Agent = Awaited<ReturnType<typeof getTestAgent>>

export function getAnonymousUser() {
  return prisma.user.create({
    data: {
      email: `${randomUUID()}${anonymousUserEmailSuffix}`,
    },
  })
}

export function cleanAnonymousUser() {
  return prisma.user.deleteMany({
    where: {
      email: {
        endsWith: anonymousUserEmailSuffix,
      },
    },
  })
}
