import { sign as jwtSign, decode as jwtDecode } from "jsonwebtoken"
import { AuthError, FatalError, getAuthFunction } from "@anfo/huiserver"
import type { User } from "@prisma/client"

const jwtAuthSecret = process.env.JWT_AUTH_SECRET
const jwtCookieSecret = process.env.JWT_COOKIE_SECRET

if (!jwtAuthSecret || !jwtCookieSecret) {
  throw new FatalError("no JWT_AUTH_SECRET ｜ JWT_COOKIE_SECRET specified!")
}

export const { sign: signAuth, decode: decodeAuth } =
  getAuthFunction(jwtAuthSecret)
export const signUser = (
  user: User,
  options?: Parameters<typeof jwtSign>[2]
) => {
  return signAuth(user, options)
}
export const decodeUser = (token: string) => {
  const ret = decodeAuth(token)
  if (ret && typeof ret === "object") {
    return ret as User
  } else {
    throw new AuthError("decode user failed(ret): ", ret)
  }
}

export const { sign: signCookie, decode: decodeCookie } =
  getAuthFunction(jwtCookieSecret)
