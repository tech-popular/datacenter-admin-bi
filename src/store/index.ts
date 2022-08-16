import { State } from './index';
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import type { App } from 'vue'

// InjectionKey 将store安装到Vue应用程序时提供类型,将类型传递InjectionKey给useStore方法
// 手动声明 state 类型
export interface State {
  curDataLink: String
  menuType: Number
  sidebarFold: Boolean
  defaultActive: String
  token: any
  menuName: String
  principal: String
}

// 定义注入类型
const key: InjectionKey<Store<State>> = Symbol()

const store = createStore<State>({
  state() {
    return {
      curDataLink: '',
      menuType: 0,
      sidebarFold: false,
      defaultActive: '',
      token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
      menuName: '',
      principal: ''
    }
  },
  mutations: {
    changeDataLink(state: State, link: String) {
      state.curDataLink = link
    },
    changeMenuType(state: State, type: Number) {
      state.menuType = type
    },
    changeSidebarFold(state: State, sidebarFold: Boolean) {
      console.log('sidebarFold: ', sidebarFold)
      state.sidebarFold = sidebarFold
    },
    updateDefaultActive(state: State, defaultActive: String) {
      state.defaultActive = defaultActive
    },
    // 修改token，并将token存入localStorage
    changeLogin(state: State, token: any) {
      state.token = token
      localStorage.setItem('token', token)
    },
    changeMenuName(state: State, menuName: string) {
      state.menuName = menuName
      sessionStorage.setItem('menuName', menuName)
    },
    changePrincipal(state: State, principal: string) {
      state.principal = Boolean(principal) ? principal : ''
      sessionStorage.setItem('principal', Boolean(principal) ? principal : '')
    }
  },
})

// 将类型注入useStore，似乎无效
export function useStore() {
  return baseUseStore(key)
}

export function setupStore(app: App<Element>) {
  app.use(store, key)
}

export default store
