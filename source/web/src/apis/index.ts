import {
	APIInstance,
	GetPaginationExtraParams,
	PaginationAPIInstance,
	GetAPIPathParameters,
	GetAPIReq,
	GetAPIRes,
	Method,
	IsPaginationAPI,
	isPaginationAPI,
	Routes,
	apiBaseURL,
} from "@/const"
import router from "@/router"
import { message } from "ant-design-vue"
import _axios from "axios"
import { urls } from "@/const"

type CommonResponse<D = any> = {
	code: number
	data?: D
	reason?: string
}

export const axios = _axios.create({
	baseURL: apiBaseURL,
})

axios.interceptors.request.use((config) => {
	return config
})
axios.interceptors.response.use(
	async (res) => {
		const data = res.data as CommonResponse
		if (data.code !== 0) {
			if (data.code === -1200) {
				if (
					router.currentRoute.value.name !== Routes.login
				) {
					message.error(data.reason)
				}
				router.push({ name: Routes.login })
			} else {
				message.error(`${data.code}: ${data.reason}`)
				throw new Error(
					`server error: ${data.code}, ${data.reason}`,
				)
			}
		} else {
			return res.data.data
		}
	},
	(err) => {
		throw err
	},
)

// 柯里化、让泛型推导一部分类型（URL）
export class API<T extends APIInstance> {
	url: T["path"]
	method: Method

	constructor(api: T) {
		this.url = api.path
		this.method = api.method
	}
	call(
		...rest: GetAPIReq<T> extends void
			? GetAPIPathParameters<T>
			: [
					...GetAPIPathParameters<T>,
					...(GetAPIReq<T> extends {}
						? [GetAPIReq<T>?]
						: [GetAPIReq<T>]),
				]
	) {
		const params = rest.slice(this.url.length)[0]
		const urlParams = rest
			.slice(0, this.url.length)
			.map((d) => d || "") as string[]
		return axios.request({
			url:
				typeof this.url === "function"
					? this.url(...urlParams)
					: this.url,
			method: this.method,
			data: params,
		}) as Promise<GetAPIRes<T>>
	}
}

export class PaginationAPI<
	T extends PaginationAPIInstance,
> extends API<T> {
	constructor(api: T) {
		super(api)
	}

	callAll(
		...rest: keyof GetPaginationExtraParams<T> extends never
			? GetAPIPathParameters<T>
			: [
					...GetAPIPathParameters<T>,
					...(GetPaginationExtraParams<T> extends {}
						? [GetPaginationExtraParams<T>?]
						: [GetPaginationExtraParams<T>]),
				]
	) {
		return this.call(
			...([
				...rest.slice(0, this.url.length),
				{
					pageNo: 1,
					pageSize: 9999999,
					...((
						rest.slice(
							this.url.length,
						) as GetPaginationExtraParams<T>[]
					)?.[0] || {}),
				},
			] as unknown as Parameters<typeof this.call>),
		)
	}
}

type Key = keyof typeof urls
export const apis = Object.keys(urls).reduce(
	(t, k) => {
		t[k as Key] = isPaginationAPI(urls[k as Key])
			? new PaginationAPI(urls[k as Key])
			: (new API(urls[k as Key]) as any)
		return t
	},
	{} as {
		[k in Key]: IsPaginationAPI<
			(typeof urls)[k]
		> extends true
			? InstanceType<
					typeof PaginationAPI<(typeof urls)[k]>
				>
			: InstanceType<typeof API<(typeof urls)[k]>>
	},
)
