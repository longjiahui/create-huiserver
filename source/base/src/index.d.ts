declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MARIA_URI?: string
            GITHUB_OAUTH_CLIENT_ID?: string
            GITHUB_OAUTH_CLIENT_SECRET?: string
            GITHUB_OAUTH_CALLBACK_URL?: string
            JWT_COOKIE_SECRET?: string
            JWT_AUTH_SECRET?: string
        }
    }
}

export {}
