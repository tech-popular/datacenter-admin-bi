import { createRouter, createWebHashHistory } from 'vue-router'
import { App, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as dd from 'dingtalk-jsapi'
// import  { ref , type } from 'vue'
import Main from '@/components/Main/Main.vue'
import dayjs from 'dayjs'
import { userVisitLog } from '@/api/api'
const routerHistory = createWebHashHistory()
// createWebHashHistory hash 路由
// createWebHistory history 路由
// createMemoryHistory 带缓存 history 路由
const router = createRouter({
  // history: routerHistory,
  history: routerHistory,
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/Main',
      component: Main,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/home/index.vue'),
        },
        {
          path: '/superset/:id',
          name: 'superset',
          component: () => import('@/views/home/superset.vue'),
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
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/index.vue'),
    },
  ]
})

const startTime: any = ref(new Date())
const currentTime: any = ref('')
const standingTime: any = ref('')
const fromPage: any = ref('')
const toPage: any = ref('')
router.beforeEach((to, from, next) => {
  if (dd.env.platform !== 'notInDingTalk') {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      let token = localStorage.getItem('token')
      if (token === null || token === '') {
        ElMessage.error({ message: 'token失效，请重新登录' })
        next('/login')
      } else {
        next()
      }
    }
  }
  // console.log('kkkk', JSON.parse(sessionStorage.getItem('menulist')))
  // 如果to存在，则说明路由发生了跳转
  if ((to.params.modelId || to.params.id) && (from.params.modelId || from.params.id)) {
    const menulistData = JSON.parse(sessionStorage.getItem('menulist'))
    // const toPage = menulistData.filter(item => item.url === to.params.modelId)[0]
    if (to.params.modelId) {
      toPage.value = menulistData.filter(item => item.url === to.params.modelId)[0]
    } else if (to.params.id) {
      toPage.value = menulistData.filter(item => item.id == to.params.id)[0]
    }
    if (from.params.modelId) {
      fromPage.value = menulistData.filter(item => item.url === from.params.modelId)[0]
    } else if (from.params.id) {
      fromPage.value = menulistData.filter(item => item.id == from.params.id)[0]
    }
    // 清空界面名
    // 离开界面
    // 第一步：页面跳转后记录一下当前的时间 currentTime
    currentTime.value = Date.now()
    standingTime.value = parseInt((currentTime.value - startTime.value) / 1000)
    // ------------
    // 第二步：在这里把 currentTime - startTime 的 差值 发送给后端
    // ------------
    if (fromPage) {
      const params = {
        // 界面
        menuName: fromPage.value.name,
        // 进入界面时间
        visitTimeStart: dayjs(startTime.value).format('YYYY-MM-DD HH:mm:ss'),
        // 离开时间
        // gmtLeave: '',
        visitTimeEnd: dayjs(currentTime.value).format('YYYY-MM-DD HH:mm:ss'),
        menuId: toPage.value.id,
        // 停留时长
        visitTime: standingTime.value,
        // 访问类型
        visitType: 2
      }
      userVisitLog(params).then(({ data }) => {
        console.log('data: ', data)
      })
    }
    // 第三步：每次都要初始化一下 startTime
    startTime.value = new Date()
  }
  next()
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}
export default router
