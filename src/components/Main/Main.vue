<template>
  <div class="xfk-main-container">
    <header class="xfk-header hidden-xs-only">
      <div class="xfk-header-left">
        <div class="xfk-brand">
          <h1>新BI系统</h1>
        </div>
        <div class="xfk-menu-switch">
          <!-- <div class="xfk-menu-switch hidden-sm-and-up"> -->
          <!-- <i class="el-icon-s-unfold"></i> -->
          <img @click="iconClick(sidebarFold)" :src="sidebarFold ? rightIcon : leftIcon" />
          <el-select placeholder="请选择" size="small" v-model="gradeName" @change="gradeClick(gradeName)" style="width: 140px;margin-left: 50px;">
            <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="xfk-header-handle">
        欢迎，
        <el-dropdown :show-timeout="0" placement="bottom">
          <span class="el-dropdown-link">{{ username }}</span>
          <template #dropdown>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item> -->
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <div class="xfk-body hidden-xs-only">
      <el-scrollbar class="xfk-side" :class="{ 'xfk-side-col': sidebarFold }">
        <SideMenu :list="pcmenuData" v-if="pcmenuData.length > 0" background-color="#222d32" text-color="#fff" active-text-color="#fff" />
      </el-scrollbar>
      <div class="xfk-content">
        <div class="xfk-content-fullPath" v-show="menuName">
          <span>{{menuName}}</span>
          <span class="xfk-content-principal">报表负责人：{{principal}}</span>
        </div>
        <el-scrollbar class="xfk-view" wrapClass="xfk-content-wrap">
          <router-view :key="$route.fullPath" />
        </el-scrollbar>
      </div>
    </div>
    <!--  移动端菜单   -->
    <MobileMenu :list="menuData" v-if="menuData.length > 0"></MobileMenu>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  defineAsyncComponent,
  ref,
  onMounted
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getmark } from '@/libs/watermark'
import { useStore } from '@/store/index'
import leftIcon from '@/styles/img/left1.png'
import rightIcon from '@/styles/img/right1.png'
const SideMenu = defineAsyncComponent(() =>
  import('./components/SideMenu/SideMenu.vue')
)
const MobileMenu = defineAsyncComponent(() =>
  import('./components/MobileMenu/MobileMenu.vue')
)
import * as dd from 'dingtalk-jsapi'
import { PcLogin, DdLogin, logout } from '@/api/api'
import { ElMessageBox, ElMessage } from 'element-plus'
export default defineComponent({
  name: 'Main',
  components: { SideMenu, MobileMenu },
  data() {
    return {
      // 移动端展示折叠菜单
      mobileMenuVisible: false
    }
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const corpId = 'ding94069beefe61f4b735c2f4657eb6378f'
    // const routerParams: any = route.query.token
    const menuData: any = ref([])
    const pcmenuData: any = ref([])
    const username: any = ref('')
    const gradeList: any = ref([])
    const gradeName: any = ref('')
    const PCgradeMenu: any = ref([])
    const store = useStore()
    const { watermark } = getmark()
    const menuName: String = computed(() => {
      return store.state.menuName
        ? store.state.menuName
        : sessionStorage.getItem('menuName')
      // return sessionStorage.getItem('menuName')
    })
    const principal: String = computed(() => {
      return store.state.principal
        ? store.state.principal
        : sessionStorage.getItem('principal')
    })
    const sidebarFold: Boolean = computed(() => {
      return store.state.sidebarFold
    })
    const iconClick = (sidebarFold: Boolean) => {
      store.commit('changeSidebarFold', !sidebarFold)
    }
    const gradeClick = (gradeNameId: any) => {
      gradeList.value.forEach(element => {
        if (element.id == gradeNameId) {
          pcmenuData.value = element.children
          console.log('pcmenuData: ', pcmenuData)
        }
      })
    }
    // const userid: any = localStorage.getItem('userId')
    const GetMenuData = async (code: any) => {
      if (code) {
        console.log('code', code)
        let res: any = await DdLogin({
          code: code
        })
        menuData.value = res.data.menulist
        username.value = res.data.username
      } else {
        let res: any = await PcLogin({
          // userId: 315
        })
        gradeList.value = res.data.menulist
        PCgradeMenu.value = []
        fnMenuRoutes(res.data.menulist)
        // localStorage.setItem('menulis', res.data.menulist)
        sessionStorage.setItem('menulist', JSON.stringify(PCgradeMenu.value))
        if (res.data.menulist.length) {
          gradeName.value =
            route.params.id || route.params.modelId
              ? findFirstMenu(PCgradeMenu.value)
              : res.data.menulist[0].id
          gradeClick(gradeName.value)
        }
        username.value = res.data.username
        watermark(res.data.username) //水印名
      }
    }
    if (dd.env.platform !== 'notInDingTalk') {
      //钉钉内打开
      dd.ready(function() {
        dd.runtime.permission.requestAuthCode({
          corpId: corpId,
          onSuccess: info => {
            GetMenuData(info.code)
          }
        })
      })
    } else {
      GetMenuData('')
    }
    // 平铺存储菜单
    const fnMenuRoutes = (menulist: any) => {
      if (menulist) {
        menulist.forEach(item => {
          if (item.children) {
            fnMenuRoutes(item.children)
          } else {
            PCgradeMenu.value.push(item)
          }
        })
      }
    }
    // 查找默认一级菜单
    const findFirstMenu = (pcmenulist: any) => {
      console.log('route.params: ', route.params)
      let menuParentList: String = ''
      if (route.params.id) {
        menuParentList = pcmenulist.filter(
          item => item.id === Number(route.params.id)
        )[0].menuParentList
      } else {
        menuParentList = pcmenulist.filter(
          item => item.url === route.params.modelId
        )[0].menuParentList
      }
      let firstParentId = menuParentList ? menuParentList.split(',')[0] : ''
      return Number(firstParentId)
    }
    // 退出
    const logoutHandle = () => {
      ElMessageBox.confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          loginOutFun()
        })
        .catch(() => {})
    }
    let loginOutFun = async () => {
      let res: any = await logout()
      if (res.data && res.data.code === 0) {
        router.push({
          path: '/login'
        })
      } else {
        ElMessage({
          type: 'info',
          message: res.data.msg
        })
      }
    }
    return {
      menuData,
      pcmenuData,
      username,
      leftIcon,
      rightIcon,
      sidebarFold,
      iconClick,
      gradeList,
      gradeClick,
      gradeName,
      fnMenuRoutes,
      PCgradeMenu,
      menuName,
      principal, // 报表负责人
      logoutHandle // 退出登陆
    }
  }
})
</script>

<style lang="scss">
.xfk-main-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .xfk-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 48px;
    background-color: #3c8dbc;
    .xfk-header-left {
      display: flex;
      height: 100%;
      align-items: center;
      .xfk-menu-switch {
        width: 100%;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        cursor: pointer;
        font-size: 28px;
        padding: 0 10px;
      }
      .xfk-welcome {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #ffffff;
        span {
          &:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
    }
    .xfk-brand {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 260px;
      height: 100%;
      padding: 0 10px;
      margin-right: 10px;
      transition: all 0.3s;
      box-sizing: border-box;
      cursor: pointer;
      h1 {
        margin: 0;
        height: 32px;
        line-height: 32px;
        font-size: 18px;
        color: hsl(0, 0%, 100%);
        text-align: center;
      }
    }
    .xfk-header-handle {
      display: flex;
      align-items: center;
      padding: 0 10px;
      color: #ffffff;
      margin-right: 40px;
      .el-dropdown-link {
        color: #ffffff;
        font-size: 18px;
      }
    }
  }
  .xfk-body {
    display: flex;
    width: 100%;
    // height: calc(100% - 20px);
    height: 100%;
    .xfk-side {
      flex-shrink: 0;
      width: 260px;
      height: 95%;
      overflow: hidden;
      background-color: #222d32;
      .el-scrollbar__wrap {
        overflow-x: hidden;
        .el-scrollbar__view {
          padding-bottom: 20px;
        }
      }
    }
    .xfk-side-col {
      flex-shrink: 0;
      width: 10px;
      height: 100%;
      overflow: hidden;
      background-color: #222d32;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    .xfk-content {
      flex-grow: 1;
      height: 90%;
      overflow: hidden;
      margin: 20px;

      .xfk-content-fullPath {
        width: 100%;
        background-color: #fff;
        font-size: 14px;
        height: 28px;
        line-height: 28px;
        padding-left: 20px;
        margin: 10px 0;
        .xfk-content-principal {
          float: right;
          padding-right: 70px;
        }
      }
      .xfk-tags {
        padding: 0;
        height: 40px;
        background: #f0f0f0;
      }
      .xfk-view {
        width: 100%;
        height: 100%;
        background-color: #ecf0f5;
        .xfk-content-wrap {
          overflow-x: hidden;
          padding: 10px;
          box-sizing: border-box;
        }
        .el-scrollbar__view {
          width: auto;
          height: 100%;
        }
      }
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
.xfk-mobile-menu {
  .mobile-menu-title {
    margin: 0;
    font-size: 24px;
    text-align: center;
  }
  .xfk-side {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #ffffff;
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>
