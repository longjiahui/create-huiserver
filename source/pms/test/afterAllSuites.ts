import { prisma } from "../src/db"
import { cleanAnonymousUser } from "./util"

module.exports = async () => {
  await cleanAnonymousUser()
  await prisma.$disconnect()
}
