import {
  setSignedCookieByContext,
  ServiceError,
  UnExpectedError,
  createModule,
  env,
  FatalError,
} from "@anfo/huiserver"
import { authenticate } from "./util/passport"
import type { User } from "@prisma/client"
import passport from "koa-passport"
import { prisma } from "../../../db"
import { isDev, urls } from "../../../const"
import { signUser } from "../../../service/jwt"

declare module "koa" {
  interface DefaultState {
    user?: User | null
  }
}

export const authMod = createModule((app) => {
  app.koa.use(passport.initialize())

  if (isDev) {
    app.httpRouter.get("/auth/debug", async (ctx) => {
      const user = await prisma.user.findFirst()
      if (user) {
        setSignedCookieByContext(ctx, "token", signUser(user), {
          httpOnly: true,
        })
      } else {
        throw new ServiceError("no user found")
      }
      ctx.redirect("/")
    })
  }

  app.httpRouter.get("/auth/github", authenticate("github"))
  app.httpRouter.get(
    "/auth/github/callback",
    authenticate("github"),
    async (ctx) => {
      const userService = app.userServiceFactory.use(ctx)
      // Successful authentication, redirect home.
      const user = await prisma.user.findUnique({
        where: { email: ctx.state.user?.email },
      })
      if (!user) {
        ctx.state.user = await userService.registerUser(ctx.state.user!)
      } else if (!user.githubID) {
        ctx.state.user = await prisma.user.update({
          where: { id: user.id },
          data: {
            githubID: ctx.state.user?.githubID || null,
            ...(!user.avatar ? { avatar: ctx.state.user?.avatar || null } : {}),
          },
        })
      } else {
        ctx.state.user = user
      }
      if (ctx.state.user) {
        setSignedCookieByContext(ctx, "token", signUser(ctx.state.user), {
          httpOnly: true,
          // 30天
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        // if (ctx.request.header.referer) {
        //   ctx.redirect(
        //     ctx.request.headers.referer!
        //     // `${ctx.request.headers.referer}?${qs.stringify({
        //     //   token: signUser(ctx.state.user),
        //     // })}`
        //   )
        // } else {
        //   ctx.redirect("/")
        // }
        ctx.redirect(env("GITHUB_OAUTH_PAGE_CALLBACK_URL"))
      } else {
        throw new UnExpectedError(
          "there is no user after github authentication"
        )
      }
    }
  )

  app.createController(
    urls.authLocal,
    app.guard.v({
      body: {
        email: "truthyString",
        password: "truthyString",
      },
    }),
    authenticate("local"),
    async (ctx) => {
      if (ctx.state.user) {
        setSignedCookieByContext(ctx, "token", signUser(ctx.state.user), {
          httpOnly: true,
        })
        return
      } else {
        throw new ServiceError("auth failed")
      }
    }
  )
}, "auth controller")
