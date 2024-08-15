import type { Prisma } from '@prisma/client'
import { prisma } from '../../db'
import { FatalError, getAuthFunction } from '@anfo/huiserver'

export async function register(u: Prisma.UserCreateArgs['data']) {
    const user = await prisma.$transaction(async (t) => {
        const user = await t.user.create({ data: u })
        return user
    })
    return user
}

if (!process.env.JWT_AUTH_SECRET) {
    throw new FatalError('JWT_AUTH_SECRET not set!')
}
export const { sign: signUser, decode: decodeUser } = getAuthFunction(
    process.env.JWT_AUTH_SECRET!
)
