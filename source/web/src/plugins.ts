import * as $const from "@/const"
import * as models from "@/models"
import router from "@/router"
import * as utils from "@/base/util"
import { App } from "vue"
import { focusPlugin } from "./base/directives"
import { i18nPlugin } from "./i18n"
import { pinia } from "./stores"

export default {
	install(app: App) {
		app.use(i18nPlugin)
		app.use(router)
		app.use(pinia)
		app.use(focusPlugin)

		app.config.globalProperties.$utils = utils
		app.config.globalProperties.$const = $const
		app.config.globalProperties.$model = models
	},
}
