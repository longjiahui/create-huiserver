import crypto from "node:crypto"
import type { PaginationBody } from "../protocol"

export function md5Password(password: string) {
  return crypto
    .createHash("md5")
    .update(password + "_hello")
    .digest("hex")
}

export function transformPaginationParams(body: PaginationBody) {
  return {
    take: body.pageSize,
    skip: (body.pageNo - 1) * body.pageSize,
  }
}
