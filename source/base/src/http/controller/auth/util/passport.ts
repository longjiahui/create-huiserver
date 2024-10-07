import passport from "koa-passport"
import { Strategy as GithubStrategy } from "passport-github"
import type { Slice1Parameters } from "@anfo/huiserver"
import { prisma } from "../../../../db"
import { UnExpectedError } from "@anfo/huiserver"
import { register } from "../service"

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET || "",
      callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, cb) => {
      const [email0] = profile.emails || []
      const [avatar0] = profile.photos || []
      const githubID = profile.id
      const { value } = email0
      const { value: avatar } = avatar0
      if (value) {
        let user = await prisma.user.findUnique({
          where: { email: value },
        })
        if (!user) {
          user = await register({
            email: value,
            name: profile.displayName,
            avatar,
            githubID,
          })
        }
        if (user) {
          cb(undefined, user)
        } else {
          throw new UnExpectedError("create user by github login failed!")
        }
      } else {
        throw new UnExpectedError("no email found from github passport profile")
      }
    }
  )
)

// export { default as passport } from 'passport'
export function authenticate(
  type: "github",
  ...rest: Slice1Parameters<typeof passport.authenticate> | []
) {
  return passport.authenticate(
    type,
    {
      session: false,
      ...rest[0],
    },
    ...(rest.length > 1 ? rest.slice(1) : ([] as any))
  )
}
