import {
    setCookieByContext,
    Module,
    ServiceError,
    UnExpectedError,
} from '@anfo/huiserver'
import { signUser } from './service'
import { authenticate } from './util/passport'
import type { User } from '@prisma/client'
import passport from 'koa-passport'
import qs from 'qs'
import { prisma } from '../../db'

declare module 'koa' {
    interface DefaultState {
        user?: User | null
    }
}

export const authMod = ((app) => {
    app.koa.use(passport.initialize())

    app.httpRouter.get('/auth/debug', async (ctx) => {
        const user = await prisma.user.findFirst()
        if (user) {
            setCookieByContext(ctx, 'token', signUser(user), {
                httpOnly: true,
            })
        } else {
            throw new ServiceError('no user found')
        }
        ctx.redirect('/')
    })

    app.httpRouter.get('/auth/github', authenticate('github'))
    app.httpRouter.get(
        '/auth/github/callback',
        authenticate('github'),
        (ctx) => {
            // Successful authentication, redirect home.
            if (ctx.state.user) {
                setCookieByContext(ctx, 'token', signUser(ctx.state.user), {
                    httpOnly: true,
                })
                if (ctx.request.header.referer) {
                    ctx.redirect(
                        `${ctx.request.headers.referer}?${qs.stringify({
                            token: signUser(ctx.state.user),
                        })}`
                    )
                } else {
                    ctx.redirect('/')
                }
            } else {
                throw new UnExpectedError(
                    'there is no user after github authentication'
                )
            }
        }
    )
}) as Module
