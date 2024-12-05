import { createModule, ServiceError } from "@anfo/huiserver"
import { urls } from "../../const"
import { prisma } from "../../db"

export const userMod = createModule((app) => {
  app.createController(urls.userMyInfo, app.guard.user(), async (ctx) => {
    const ret = await prisma.user.findUnique({
      where: { id: ctx.state.user!.id },
      omit: { password: true },
    })
    if (!ret) {
      throw new ServiceError("user not found")
    }
    return ret
  })
}, "user controller")
