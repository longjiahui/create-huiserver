import baseConfig from "./vite.dev.base.config"
import { defineConfig, mergeConfig } from "vite"

// https://vitejs.dev/config/
export default mergeConfig(
	baseConfig,
	defineConfig({
		server: {
			proxy: {
				"/api/": {
					rewrite: (p) => {
						return p.replace("/api", "")
					},
					target: "http://localhost:3000",
				},
				// "/api": {
				// 	target: "https://okr.anfo.fun",
				// 	changeOrigin: true,
				// },
			},
		},
	}),
)
