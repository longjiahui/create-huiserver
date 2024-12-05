import vueJsx from "@vitejs/plugin-vue-jsx"
import AutoImport from "unplugin-auto-import/vite"
import AutoImportComponents from "unplugin-vue-components/vite"
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"
import { defineConfig } from "vite"

export default defineConfig({
	optimizeDeps: {
		include: ["ant-design-vue/es", "uuid"],
	},
	plugins: [
		vueJsx(),
		AutoImport({
			imports: ["vue", "@vueuse/core"],
			dts: "src/auto-imports.d.ts",
			resolvers: [AntDesignVueResolver()],
		}),
		AutoImportComponents({
			// default: src.components
			dirs: [
				"src/base/components",
				"src/bizComponents",
				"src/viewComponents",
			],
			extensions: ["vue"],
			deep: true,
			dts: "src/components.d.ts",
			resolvers: [
				AntDesignVueResolver({
					resolveIcons: true,
					importStyle: false,
				}),
			],
		}),
	],
	resolve: {
		alias: {
			"@": "/src",
		},
	},
})
