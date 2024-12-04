import { decodeUser } from "../../service/jwt"
import { AuthError, createModule, mergeGuard } from "@anfo/huiserver"
import type { Context, GuardFunction, Module, v } from "@anfo/huiserver"
import { getSignedCookieByContext } from "@anfo/huiserver"
import type { Next } from "koa"
import { prisma } from "../../db"

type Role = any

function userGuard(role?: Role) {
  return async (ctx: Context, next: Next) => {
    const token =
      getSignedCookieByContext(ctx, "token") ||
      ctx.request.headers.authorization
    if (token) {
      const user = decodeUser(token)
      ctx.state.user = await prisma.user.findUnique({
        where: { email: user.email },
      })
      if (!ctx.state.user) {
        throw new AuthError("没找到用户嗷")
      }
    } else {
      throw new AuthError("没找到token嗷")
    }
    return next()
  }
}
declare module "@anfo/huiserver" {
  interface ApplicationGuard {
    user: typeof userGuard
    userv: (...rest: Parameters<typeof v>) => GuardFunction
  }
}

export const guardMod = createModule((app) => {
  app.guard.user = userGuard
  app.guard.userv = (...rest) => mergeGuard(userGuard(), app.guard.v(...rest))
}, "user guard")
