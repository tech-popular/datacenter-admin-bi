import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
// import { injectHtml, minifyHtml } from 'vite-plugin-html'
import path from 'path'
const resolve = (dir: string) => path.join(__dirname, dir)

export default defineConfig({
	plugins: [
		vue(),
		createHtmlPlugin({
			inject: {
				data: {
					title: 'BI报表',
					htmlWebpackPlugin: {
						options: {
							isVite: true,
							shotcut: './src/static/image/favicon.ico',
						}
					},
				},
			},
		})
	],
	base: "./",
	resolve: {
		alias: {
			'@': resolve('/src'),
			comps: resolve('src/components'),
			apis: resolve('src/api'),
			views: resolve('src/views'),
			utils: resolve('src/utils'),
			routes: resolve('src/routes'),
			styles: resolve('src/styles')
		}
	},
	server: {
		//服务器主机名
		host: '',
		//端口号
		port: 3088,
		//设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
		strictPort: false,
		//服务器启动时自动在浏览器中打开应用程序,当此值为字符串时，会被用作 URL 的路径名
		open: false,
		//自定义代理规则
		proxy: {
			// 选项写法
			'/canary-admin/': {
				target: 'http://192.168.208.14:8000/canary-admin/',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/canary-admin/, '')
			}
		}
	}
})

