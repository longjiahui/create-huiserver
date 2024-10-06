import { decodeUser } from '../service/jwt'
import { AuthError } from '@anfo/huiserver'
import type { Context, Module } from '@anfo/huiserver'
import { getSignedCookieByContext } from '@anfo/huiserver'
import type { Next } from 'koa'
import { prisma } from '../db'

type Role = any

function userGuard(role?: Role) {
    return async (ctx: Context, next: Next) => {
        const token =
            getSignedCookieByContext(ctx, 'token') ||
            ctx.request.headers.authorization
        if (token) {
            const user = decodeUser(token)
            ctx.state.user = await prisma.user.findUnique({
                where: { email: user.email },
            })
            if (!ctx.state.user) {
                throw new AuthError('没找到用户嗷')
            }
        } else {
            throw new AuthError('没找到token嗷')
        }
        return next()
    }
}
declare module '@anfo/huiserver' {
    interface ApplicationGuard {
        user: typeof userGuard
    }
}

export const guardMod = ((app) => {
    app.guard.user = userGuard
}) as Module
