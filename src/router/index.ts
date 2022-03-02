import { createRouter, createWebHashHistory } from 'vue-router'
import type { App } from 'vue'
import Main from '@/components/Main/Main.vue'
import * as dd from 'dingtalk-jsapi'
// import { useRoute } from 'vue-router'
const routerHistory = createWebHashHistory()
// createWebHashHistory hash 路由
// createWebHistory history 路由
// createMemoryHistory 带缓存 history 路由
const router = createRouter({
  history: routerHistory,
  routes: [
    // {
    //   path: '/',
    //   redirect: '/login'
    // },
    {
      path: '/',
      component: Main,
      // redirect: '/Main',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/home/index.vue'),
        },
        {
          path: '/report/:modelId',
          name: 'report',
          component: () => import('@/views/report/tableData.vue'),
        },
        {
          path: '/tableau/:modelId',
          name: 'tableau',
          component: () => import('@/views/report/tableau.vue'),
        },
      ],
    },
    // {
    //   path: "/login",
    //   name: "login",
    //   component: ()=>import("@/views/Login/index.vue"),
    // },
  ],
})
/*
    全局守卫
  */
router.beforeEach((to, from, next) => {
  console.log('from: ', from)
  console.log('to: ', to)
  const token: any = localStorage.getItem('token')
  if (dd.env.platform === 'notInDingTalk') {
    if (!token || !/\S/.test(token)) {
      if (process.env.NODE_ENV != 'production') {
        window.location.href = 'http://test.tech.9fbank.com/canary/#/login' //test
      } else {
        window.location.href = 'http://tech.9fbank.com/canary/#/login'
      }
    }
    next()
  }
})
export function setupRouter(app: App<Element>) {
  app.use(router)
}
export default router
