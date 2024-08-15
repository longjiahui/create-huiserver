declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MARIA_URI?: string
        }
    }
}

export {}
