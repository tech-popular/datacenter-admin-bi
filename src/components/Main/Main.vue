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
          <el-select placeholder="请选择" v-model="gradeName" @change="gradeClick(gradeName)" style="width: 140px;height: 40px; margin-left: 50px; line-height: 36px;">
            <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="xfk-header-handle">
        欢迎，
        <span>{{ username }}</span>！
      </div>
    </header>
    <div class="xfk-body hidden-xs-only">
      <el-scrollbar class="xfk-side" :class="{ 'xfk-side-col': sidebarFold }">
        <SideMenu :list="menuData" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" />
      </el-scrollbar>
      <div class="xfk-content">
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
import { computed, defineComponent, defineAsyncComponent, ref } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store/index'
// import { useRoute } from 'vue-router'
import leftIcon from '@/styles/img/left1.png'
import rightIcon from '@/styles/img/right1.png'
const SideMenu = defineAsyncComponent(() =>
  import('./components/SideMenu/SideMenu.vue')
)
const MobileMenu = defineAsyncComponent(() =>
  import('./components/MobileMenu/MobileMenu.vue')
)
import * as dd from 'dingtalk-jsapi'
import { PcLogin, DdLogin } from '@/api/api'
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
    // const route = useRoute()
    // const router = useRouter()
    const corpId = 'ding94069beefe61f4b735c2f4657eb6378f'
    // const userId: any = route.query.userId
    // console.log('userId11: ', userId)
    // const token: any = route.query.token
    // console.log('token:222 ', token)
    const menuData: any = ref([])
    const username: any = ref('')
    const gradeList: any = ref([])
    const gradeName: any = ref('')
    // if (token) {
    //   localStorage.setItem('token', token)
    //   localStorage.setItem('userId', userId)
    // }
    // if (route.query.token && localStorage.getItem('token')) {
    //   router.push({
    //     path: '/home'
    //   })
    // }

    const store = useStore()
    const sidebarFold: any = computed(() => {
      return store.state.sidebarFold
    })
    const iconClick = (sidebarFold: any) => {
      console.log(!sidebarFold)
      store.commit('changeSidebarFold', !sidebarFold)
    }
    const gradeClick = (gradeName: any) => {
      console.log('gradeName: ', gradeName)
      gradeList.value.forEach(element => {
        if (element.id == gradeName) {
          menuData.value = element.children
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
        // res.data.menulist.forEach(element => {
        //   if (element.grade === 1) {
        //     gradeList.value.push(element)
        //   }
        // })
        // console.log('gradeList: ', gradeList.value)
        gradeList.value = res.data.menulist
        gradeName.value = res.data.menulist[0].id
        menuData.value = res.data.menulist[0].children
        username.value = res.data.username
      }
    }
    if (dd.env.platform !== 'notInDingTalk') {
      //钉钉内打开
      dd.ready(function() {
        dd.runtime.permission.requestAuthCode({
          corpId: corpId,
          onSuccess: info => {
            GetMenuData(info.code)
            console.log('info.code', info.code)
          }
        })
      })
    } else {
      GetMenuData('')
    }
    // else {
    //   // window.location.href = "http://test.tech.9fbank.com/canary/#/login?from=newbi"; //test
    //   window.location.href = "http://tech.9fbank.com/canary/#/login";
    // }
    console.log('menuData', menuData.value)
    return {
      menuData,
      username,
      leftIcon,
      rightIcon,
      sidebarFold,
      iconClick,
      gradeList,
      gradeClick,
      gradeName
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
    height: 60px;
    background-color: #545c64;
    .xfk-header-left {
      display: flex;
      height: 100%;
      align-items: center;
      .xfk-menu-switch {
        width: 100%;
        height: 60px;
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
      min-width: 200px;
      height: 100%;
      padding: 0 10px;
      margin-right: 10px;
      transition: all 0.3s;
      background-color: #434a50;
      box-sizing: border-box;
      cursor: pointer;
      h1 {
        margin: 0;
        font-size: 26px;
        color: #ffd04b;
        text-align: center;
      }
    }
    .xfk-header-handle {
      display: flex;
      align-items: center;
      padding: 0 10px;
      color: #ffffff;
    }
  }
  .xfk-body {
    display: flex;
    width: 100%;
    height: calc(100% - 60px);
    .xfk-side {
      flex-shrink: 0;
      width: 200px;
      height: 100%;
      overflow: hidden;
      background-color: #545c64;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    .xfk-side-col {
      flex-shrink: 0;
      width: 10px;
      height: 100%;
      overflow: hidden;
      background-color: #545c64;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    .xfk-content {
      flex-grow: 1;
      height: 100%;
      overflow: hidden;
      .xfk-tags {
        padding: 0;
        height: 40px;
        background: #f0f0f0;
      }
      .xfk-view {
        width: 100%;
        height: 100%;
        .xfk-content-wrap {
          overflow-x: hidden;
          padding: 10px;
          box-sizing: border-box;
        }
        .el-scrollbar__view {
          width: 100%;
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
