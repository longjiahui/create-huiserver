import { API } from "../protocol"

export const urls = {
  authLocal: new (API<{
    email: string
    password: string
  }>())(() => "/auth/local"),
}
