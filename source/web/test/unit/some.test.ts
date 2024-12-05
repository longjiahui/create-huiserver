import plugins from "@/plugins"
import HomePage from "@/views/MainLayout.vue"
import { mount } from "@vue/test-utils"
import { describe, it } from "vitest"

describe("ManagementUser", () => {
	it("hello", () => {
		mount(HomePage, {
			global: {
				plugins: [plugins],
			},
		})
	})
})
