import crypto from "node:crypto"

export function md5Password(password: string) {
  return crypto
    .createHash("md5")
    .update(password + "_hello")
    .digest("hex")
}
