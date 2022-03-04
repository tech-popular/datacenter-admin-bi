import { createApp } from 'vue'
import { setupStore } from './store' // 状态管理
import router, { setupRouter } from './router' // 路由

import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import Vant from 'vant'
import 'vant/lib/index.css'

import './styles/index.scss'
import 'element-plus/theme-chalk/display.css'

// import VConsole from 'vconsole'
// if (process.env.NODE_ENV != 'production') {
//开发环境 development
// new VConsole()
// }

const app = createApp(App)

setupRouter(app) // 引入路由

setupStore(app) // 引入状态管理

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(Vant)

router.isReady().then(() => {
  app.mount('#app')
})
