/// <reference types="vite/client" />
import * as $const from "@/const"
import * as models from "@/models"
import router from "@/router"
import * as utils from "@/base/util"

declare module "vue" {
	interface ComponentCustomProperties {
		$const: typeof $const
		$router: typeof router
		$utils: typeof utils
		$model: typeof models
		"v-focus": void
	}
}

declare module "vue-router" {
	interface RouteMeta {}
}
