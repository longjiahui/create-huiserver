import {
  createGuard,
  createModule,
  type GuardFunction,
  mergeGuard,
} from "@anfo/huiserver"
import {
  numberGuard,
  paramGuard,
} from "@anfo/huiserver/dist/module/http/guard/param"
import { clamp } from "lodash"

declare module "@anfo/huiserver" {
  interface ApplicationGuard {
    paginationParams: () => GuardFunction
    userPaginationParams: () => GuardFunction
  }
}

export const paginationParamsGuardMod = createModule((app) => {
  app.guard.paginationParams = () =>
    mergeGuard(
      numberGuard("pageSize"),
      numberGuard("pageNo"),
      paramGuard("pageSize", (val) => Math.floor(clamp(val, 1, 100))),
      paramGuard("pageNo", (val) => Math.floor(Math.max(1, val)))
    )

  app.guard.userPaginationParams = () =>
    mergeGuard(app.guard.user(), app.guard.paginationParams())
}, "pagination params guard")
