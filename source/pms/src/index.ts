import { Application } from "@anfo/huiserver"

import * as mods from "./http"
import * as otherMods from "./otherMods"

Application.create().then(async (app) => {
  await Promise.all(Object.values(otherMods).map((m) => app.use(m)))
  await Promise.all(Object.values(mods).map((m) => app.use(m)))
  await app.start(3000)
})
