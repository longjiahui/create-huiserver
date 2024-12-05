import {
	AllowedComponentProps,
	VNodeProps,
	type DefineComponent,
} from "vue"

// 用于临时解决 vue3 中InstanceType<typeof Component>中component为genericComponent 会报错的问题
export type GenericComponent<T> = T extends new (
	...args: any[]
) => infer R
	? R
	: T extends (...args: any[]) => infer R
		? R extends { __ctx?: infer K }
			? Exclude<K, void> extends {
					expose: (...args: infer K) => void
				}
				? K[0] & InstanceType<DefineComponent>
				: any
			: any
		: any

export type ComponentProps<C extends Component> =
	C extends new (...args: any) => any
		? Omit<
				InstanceType<C>["$props"],
				keyof VNodeProps | keyof AllowedComponentProps
			>
		: never
