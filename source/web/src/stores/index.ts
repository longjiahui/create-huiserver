import { apis } from "@/apis"
import { createPinia, defineStore } from "pinia"

export const useDefaultStore = defineStore(
	"default",
	() => {
		const myInfo =
			ref<
				Awaited<ReturnType<typeof apis.userMyInfo.call>>
			>()
		function updateMyInfo() {
			apis.userMyInfo
				.call()
				.then((d) => (myInfo.value = d))
		}
		updateMyInfo()
		return {
			myInfo,
			updateMyInfo,
		}
	},
)
export const pinia = createPinia()
