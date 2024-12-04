import { Application, createModule } from "@anfo/huiserver"
import { APIInstance, GetAPIPathParameters, type GetAPIRes } from "../protocol"
import { Middleware } from "koa"
import { Prisma } from "@prisma/client"
import { prisma } from "../db"

type APIWithPaths<T extends APIInstance> = GetAPIPathParameters<T> extends []
  ? T
  : [T, ...GetAPIPathParameters<T>]

function _createController(app: Application) {
  return <T extends APIInstance>(
    api: APIWithPaths<T>,
    ...middlewares: [
      ...Middleware[],
      (...rest: Parameters<Middleware>) => Promise<GetAPIRes<T>> | GetAPIRes<T>
    ]
  ) => {
    const pathRest = (
      api instanceof Array ? api.slice(1) : []
    ) as GetAPIPathParameters<T>
    const finalAPI = (api instanceof Array ? api[0] : api) as T
    app.httpRouter[
      finalAPI.method.toLowerCase() as Lowercase<typeof finalAPI.method>
    ](finalAPI.path(...pathRest), ...(middlewares as Middleware[]))
  }
}

function _createUpdateController(app: Application) {
  return <Model extends Uncapitalize<Prisma.ModelName>, T extends APIInstance>(
    url: APIWithPaths<T>,
    db: Model,
    fields: Partial<
      Record<
        keyof NonNullable<
          Awaited<ReturnType<(typeof prisma)[Model]["findFirst"]>>
        >,
        string
      >
    >
  ) => {
    app.createController(
      url as any,
      app.guard.userv({
        params: {
          id: "truthyString",
        },
        body: fields,
      }),
      async (ctx) => {
        return (prisma[db].update as Function)({
          where: { id: ctx.params.id, userId: ctx.state.user!.id },
          data: Object.keys(fields).reduce((t, k) => {
            t[k] = (ctx.request.body as any)[k]
            return t
          }, {} as any),
        })
      }
    )
  }
}

declare module "@anfo/huiserver" {
  interface Application {
    createController: ReturnType<typeof _createController>
    createUpdateController: ReturnType<typeof _createUpdateController>
  }
}

export const controllerHelperMod = createModule((app) => {
  app.createController = _createController(app)
  app.createUpdateController = _createUpdateController(app)
}, "controllerHelper")
