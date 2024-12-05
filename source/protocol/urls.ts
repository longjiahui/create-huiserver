import { User } from "@prisma/client"
import { API } from "../protocol"

export const urls = {
  authLocal: new (API<{
    email: string
    password: string
  }>())(() => "/auth/local"),
  userMyInfo: new (API<void, Omit<User, "password">>())(() => `/user/myInfo`),
}
