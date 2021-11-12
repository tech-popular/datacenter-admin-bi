<template>
  <div class="xfk-main-container">
    <header class="xfk-header hidden-xs-only">
      <div class="xfk-header-left">
        <div class="xfk-brand">
          <h1>新BI系统</h1>
        </div>
        <div class="xfk-menu-switch hidden-sm-and-up">
          <i class="el-icon-s-unfold"></i>
        </div>
        <div class="xfk-welcome"></div>
      </div>
      <div class="xfk-header-handle">欢迎，<span>张三</span>！</div>
    </header>
    <div class="xfk-body hidden-xs-only">
      <el-scrollbar class="xfk-side">
        <SideMenu
          :list="menuData"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        />
      </el-scrollbar>
      <div class="xfk-content">
        <el-scrollbar class="xfk-view" wrapClass="xfk-content-wrap">
          <router-view :key="$route.fullPath" />
        </el-scrollbar>
      </div>
    </div>
    <!--  移动端菜单   -->
    <MobileMenu :list="menuData"></MobileMenu>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref } from "vue";
import { useRoute } from "vue-router";
const SideMenu = defineAsyncComponent(() => import('./components/SideMenu/SideMenu.vue'))
const MobileMenu = defineAsyncComponent(() => import('./components/MobileMenu/MobileMenu.vue'))
import * as dd from "dingtalk-jsapi";
import { login } from "@/api/api";
export default defineComponent({
  name: "Main",
  components: { SideMenu, MobileMenu },
  data() {
    return {
      // 移动端展示折叠菜单
      mobileMenuVisible: false,
    };
  },
  setup() {
    const route = useRoute();
    const corpId = route.query.corpId;
    // const userId = route.query.userId;
    const menuData: any = ref([
      {
        id: "254d95d2177344f69aa98aab2d4d9ef6",
        name: "部门管理",
        path: "http://192.168.216.1:8787/superset/dashboard/2/?preselect_filters=%7B%7D&standalone=true&native_filters=%28%29",
        type: "C",
        visible: true,
        children: null,
      },
      {
        id: "33e8baf9c3e343f69abd69eb034ff84d",
        name: "员工管理",
        path: "http://192.168.161.216:8088/superset/dashboard/world_health/?preselect_filters=%7B%7D&standalone=true&native_filters=%28%29",
        type: "C",
        visible: true,
        children: null,
      },
      {
        id: "783d72be93e849829732bad8a8366079",
        name: "组织机构",
        path: "",
        type: "M",
        visible: true,
        children: [
          {
            id: "fdb04e909aa2482f8472de6cb12c7eec",
            name: "组织管理",
            path: "/organization-manage/list",
            type: "C",
            visible: true,
            children: null,
          },
          {
            id: "690c646dbad34d65ad602231dc9da7d9",
            name: "岗位管理",
            path: "/position-manage/list",
            type: "M",
            visible: true,
            children: [
              {
                id: "fdb04e909aa2482f8472de6cb12c7eec",
                name: "组织管理",
                path: "/organization-manage/list",
                type: "C",
                visible: true,
                children: null,
              },
            ],
          },
        ],
      },
      {
        id: "d0a2616bc1e6448f8e29b91d31c73321",
        name: "角色管理",
        parentId: "783d72be93e849829732bad8a8366079",
        icon: "iconfont iconjiaose",
        path: "/role-manage/list",
        component: null,
        sort: 4,
        isFrame: 1,
        type: "C",
        status: true,
        visible: true,
        perms: "",
        open: null,
        remark: "",
        appCode: "0000000000000000",
        root: null,
        children: null,
        needCheck: null,
        permissionMethod: null,
        permissionUrl: null,
      },
    ]);
    if (dd.env.platform !== "notInDingTalk") {
      //钉钉内打开
      dd.ready(function () {
        dd.runtime.permission.requestAuthCode({
          corpId: corpId,
          onSuccess: (info) => {
            GetMenuData(info.code,'');
          },
        });
      });
    }
    const GetMenuData = async (code: any, userId: any) => {
      let res: any = await login({
        code: code,
        userId: userId,
      });
      menuData.value = res;
    };
    return {
      menuData,
    };
  },
});
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
