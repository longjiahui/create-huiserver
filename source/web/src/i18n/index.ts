import { Plugin } from "vue"
import { createI18n } from "vue-i18n"
import * as locales from "./locales"
import { StorageKey } from "@/const"

const getBrowserLocale = () => {
	const navigatorLocale =
		navigator.language || navigator.languages[0]
	return navigatorLocale
		? navigatorLocale.split("-")[0]
		: "en"
}
const browserLocale = getBrowserLocale()
const defaultLocale = useLocalStorage<
	typeof browserLocale
>(StorageKey.locale, browserLocale)
console.log("browserLocale: ", browserLocale)
console.log(
	"defaultLocale: ",
	defaultLocale.value,
)
const _i18nPlugin = createI18n({
	locale: defaultLocale.value,
	fallbackLocale: defaultLocale.value,
	messages: JSON.parse(JSON.stringify(locales)),
})

export const i18nPlugin = ((app) => {
	app.use(_i18nPlugin)
}) as Plugin
