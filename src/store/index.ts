import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import type { App } from 'vue'

// InjectionKey 将store安装到Vue应用程序时提供类型,将类型传递InjectionKey给useStore方法
// 手动声明 state 类型
export interface State {
  curDataLink: String
  menuType: Number
  sidebarFold: Boolean
}

// 定义注入类型
const key: InjectionKey<Store<State>> = Symbol()

const store = createStore<State>({
  state() {
    return {
      curDataLink: '',
      menuType: 0,
      sidebarFold: false,
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
