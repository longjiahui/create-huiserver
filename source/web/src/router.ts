import {
	createRouter,
	createWebHashHistory,
} from "vue-router"
import { Routes } from "./const"

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			redirect: { name: Routes.default },
			component: () => import("@/views/MainLayout.vue"),
			children: [
				{
					path: "/",
					name: Routes.default,
					component: () => import("@/views/Home.vue"),
				},
			],
		},
		{
			path: "/:catchAll(.*)",
			name: Routes.pageNotFound,
			component: () =>
				import("@/views/PageNotFound.vue"),
		},
	],
})

export default router
