<template>
	<Dialog
		:dialog
		:title="$t('editSystemSettingDialog.title')"
	>
		<template #autoPadding>
			<div class="flex items-center gap-s">
				<div>
					{{ $t("editSystemSettingDialog.selectLocale") }}
				</div>
				<Select
					class="w-[160px]"
					:model-value="setting?.locale ?? $i18n.locale"
					@update:model-value="
						(locale) => {
							return apis.userSettingUpdate
								.call({
									locale,
								})
								.then(() => {
									return defaultStore.updateMyInfo()
								})
						}
					"
					:options="
						$i18n.availableLocales.map((l) => ({
							id: l,
							name: {
								zh: '简体中文',
								en: 'English',
								ja: '日本語',
							}[l],
						}))
					"
				>
					{{ $i18n.locale }}
				</Select>
			</div>
		</template>
		<template #footer>
			<Button @click="dialog.close()">{{
				$t("dialog.defaultCancel")
			}}</Button>
		</template>
	</Dialog>
</template>
<script setup lang="ts">
import { apis } from "@/apis"
import { AnyDialogType } from "@/base/components/dialog/dialog"
import { useDefaultStore } from "@/stores"
import { UserSetting } from "@prisma/client"

defineProps<{
	dialog: AnyDialogType
}>()

const defaultStore = useDefaultStore()
const setting = computed<
	UserSetting | null | undefined
>(() => defaultStore.myInfo?.userSetting)
</script>
