<template>
  <div class="mobileMenuwrap">
    <div @click="showPopup">
      <div class="topTop">
        <div class="topTitle">{{ title }}</div>
        <van-icon name="arrow-down" />
      </div>
    </div>
    <van-popup
      v-model:show="show"
      closeable
      position="bottom"
      :style="{ height: '30%' }"
    >
      <div
        class="popupItem"
        v-for="item in list"
        :key="item.id"
        @click="getTitle(item)"
      >
        {{ item.name }}
      </div>
    </van-popup>
    <div v-for="item in itemList" :key="item.id">
      <div class="siderBar">
        <van-sidebar v-model="sctive">
          <van-sidebar-item
            v-for="(children,index) in item.children"
            :key="children.id"
            :title="children.name"
            @click="onChange(item,index)"
          />
        </van-sidebar>
      </div>
      <div class="centerList">
        <div v-for="item in menuList" :key="item.id">
          <div
            class="center"
            v-for="item in item.children"
            :key="item.id"
            @click="getTo(item.url)"
          >
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, PropType, onMounted } from "vue";
export interface ColumnProps {
  id: any;
  name: any;
  children: any;
}
export default defineComponent({
  name: "SideMenu",
  components: {},
  props: {
    list: Array as PropType<ColumnProps[]>,
  },
  setup(props) {
    const state: {
      sctive?: any;
      show?: any;
      title?: any;
      optionId?: any;
      showPopup?: any;
      getTitle?: any;
      itemList: Array<ColumnProps>;
      menuList: Array<ColumnProps>;
    } = reactive({
      sctive: 0,
      show: false,
      title: "",
      optionId: 0,
      itemList: [],
      menuList: [],
      showPopup: () => {
        state.show = true;
      },
      getTitle: (items) => {
        state.itemList = (props.list as ColumnProps[]).filter((item) => {
          return item.id == items.id;
        });
        state.title = items.name;
        state.optionId = items.id;
        state.show = false;
      },
    });

    let initItem = () => {
      state.title = (props.list as ColumnProps[])[0].name;
      state.itemList.push((props.list as ColumnProps[])[0]);
      state.menuList.push((props.list as ColumnProps[])[0].children[0]);
    };
    let onChange = (items,index) => {
      // console.log('items',items)
      state.menuList = (items.children as ColumnProps[]).filter((item) => {
        return item.id == items.children[index].id;
      });
      console.log('menulist',state.menuList)
    };
    let getTo = (url) => {
      window.open(url, "_blank"); // 新窗口打开外链接
    };
    onMounted(() => {
      initItem();
    });
    return { ...toRefs(state), initItem, onChange,getTo };
  },
});
</script>

<style lang="scss">
.mobileMenuwrap {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .topTop {
    background-color: rgb(236, 236, 236);
    display: flex;
    align-items: center;
    .topTitle {
      width: auto;
      padding: 15px;
    }
  }

  .el-cascader-panel {
    width: 100%;
    height: 100%;
    .el-cascader-menu {
      width: 25%;
      min-width: 100px;
      .el-cascader-node {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
  .centerList {
    float: left;
    margin-left: 10px;
    width: 200px;
    height: 100%;
    .center {
      padding: 15px;
      .img {
        width: 20px;
        height: 20px;
        background-color: #ccc;
        float: left;
      }
      span {
        margin-left: 10px;
      }
    }
  }
}
.van-sidebar {
  width: 100% !important;
  .van-sidebar-item {
    width: 100%;
    --van-sidebar-padding: 15px ;
  }
  .van-sidebar-item--select::before {
    height: 100% !important;
    background-color: #1e90ff !important;
  }
}

.siderBar {
  width: 30% !important;
  height: 100vh;
  float: left;
  background-color: #f7f8fa;
}
.van-dropdown-menu__bar {
  background-color: #f7f8fa;
  .van-dropdown-menu__item {
    flex: unset;
    margin-left: 3%;
  }
}
.van-popup {
  padding-top: 50px;
  .popupItem {
    margin: auto;
    width: 80%;
    height: auto;
    font-size: 100%;
    text-align: center;
    line-height: 50px;
    border-bottom: 1px solid rgb(241, 241, 241);
  }
}
</style>
