import { env, FatalError } from "@anfo/huiserver"

declare module "@anfo/huiserver" {
  interface ServerEnv {
    GITHUB_OAUTH_PAGE_CALLBACK_URL: string

    MARIA_URI: string
  }
}

if (!env("MARIA_URI") || !env("GITHUB_OAUTH_PAGE_CALLBACK_URL")) {
  throw new FatalError(
    "one of MARIA_URI, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, GITHUB_OAUTH_PAGE_CALLBACK_URL is not set"
  )
}
export {}
