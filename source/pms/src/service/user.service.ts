import { Application, Context, createModule, FatalError } from "@anfo/huiserver"
import { User } from "@prisma/client"
import { prisma, TransactionType } from "../db"
import { md5Password } from "../util"
import { createServiceFactory, Service, UseService } from "./base"

class UserService extends Service {
  registerUser(user: Partial<User> & Pick<User, "email">) {
    return this.t.user.create({
      data: {
        ...user,
        // md5 password
        ...(user.password ? { password: md5Password(user.password) } : {}),
      },
    })
  }
}

declare module "@anfo/huiserver" {
  interface Application {
    userServiceFactory: UseService<UserService>
  }
}

export const userServiceMod = createModule((app) => {
  app.userServiceFactory = createServiceFactory(app, UserService)
}, "user service")
