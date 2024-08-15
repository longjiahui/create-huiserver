import { Application } from '@anfo/huiserver'

import * as mods from './http'

Application.create().then(async (app) => {
    await Promise.all(Object.values(mods).map((m) => app.use(m)))
    await app.start(3000)
})
