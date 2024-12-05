<template>
	<AConfigProvider :locale>
		<router-view></router-view>
	</AConfigProvider>
</template>
<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN"
import enUS from "ant-design-vue/es/locale/en_US"
import jaJP from "ant-design-vue/es/locale/ja_JP"

import ZHLocale from "dayjs/locale/zh-cn"
import ENLocale from "dayjs/locale/en"
import JALocale from "dayjs/locale/ja"

import dayjs from "dayjs"
import { useI18n } from "vue-i18n"
import { useDefaultStore } from "./stores"

const i18n = useI18n()
const defaultStore = useDefaultStore()
watch(
	() => defaultStore.myInfo?.userSetting?.locale,
	(val) => {
		if (val) {
			i18n.locale.value = val
		}
	},
	{
		immediate: true,
	},
)
watch(
	i18n.locale,
	(val) => {
		console.debug("locale change: ", val)
		dayjs.locale(
			{
				en: ENLocale,
				zh: ZHLocale,
				ja: JALocale,
			}[val],
		)
	},
	{
		immediate: true,
	},
)
const locale = computed(
	() =>
		({
			zh: zhCN,
			en: enUS,
			ja: jaJP,
		})[i18n.locale.value],
)
</script>
<style lang="scss" scoped></style>
