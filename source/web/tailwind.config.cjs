const color = require("color")
const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			boxShadow: {
				DEFAULT: "rgba(0,0,0,.1) 0 0 32px",
			},
			borderRadius: {
				DEFAULT: "6px",
			},
			spacing: {
				xs: "8px",
				xxs: "4px",
				xxxs: "2px",
				s: "16px",
				m: "24px",
				l: "32px",
				xl: "40px",
			},
			colors: {
				"primary-lighter": color("#3875F6")
					.lighten(0.2)
					.hex(),
				primary: "#3875F6",
				"primary-darker": color("#3875F6")
					.darken(0.2)
					.hex(),
				danger: "#EC5B56",
				info: "#1677ff",
				warn: "#EFB041",
				link: "#1677ff",
				success: "#56C41A",
				"danger-light": "#F4E3E3",
				"info-light": "#E9F4FE",
				"warn-light": "#F4F0E3",
			},
			textColor: {
				dark: "#111",
				default: "#333",
				light: "#666",
				lighter: "#999",
				lightest: "#ccc",
			},
			backgroundColor: {
				"light-1": "#fafafa",
				"light-2": "#f3f3f3",
				"light-3": "#eaeaea",
				"light-4": "#e3e3e3",
				"light-5": "#dadada",
				"light-6": "#d3d3d3",
			},
			fontSize: {
				base: "14px",
				sm: "12px",
				md: "16px",
				lg: "18px",
				xl: "20px",
				xxl: "22px",
			},
			borderColor: {
				DEFAULT: "#efefef",
				"dark-1": "#e3e3e3",
				"dark-2": "#dedede",
				"dark-3": "#d3d3d3",
				"dark-4": "#cecece",
				"dark-5": "#c3c3c3",
			},
			lineHeight: {
				multi: 1.3,
			},
		},
	},
	plugins: [],
	important: true,
}
