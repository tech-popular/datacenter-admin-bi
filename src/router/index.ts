import { createRouter, createWebHashHistory } from "vue-router";
import type { App } from 'vue'
import Main from "@/components/Main/Main.vue";

const routerHistory = createWebHashHistory();
// createWebHashHistory hash 路由
// createWebHistory history 路由
// createMemoryHistory 带缓存 history 路由

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: "/Main",
      component: Main,
      children: [
        {
          path: "/",
          name: "home",
          component: () => import("@/views/home/index.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: ()=>import("@/views/Login/index.vue"),
    },
  ],
});
export function setupRouter(app: App<Element>) {
  app.use(router);
}
export default router;
