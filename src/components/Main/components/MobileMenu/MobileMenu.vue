<template>
  <div class="mobileMenuwrap">
    <!-- <el-cascader-panel :options="list" :props="propsOptions" /> -->
    <div v-for="item in list" :key="item.id">
      <div class="topTitle">{{ item.name }}</div>
    </div>
    <div v-for="item in list" :key="item.id">
      <div class="siderBar">
        <van-sidebar v-model="sctive">
          <van-sidebar-item
            v-for="children in item.children"
            :key="children.id"
            :title="children.name"
          />
        </van-sidebar>
      </div>
      <div class="centerList">
        <div v-for="childrens in item.children" :key="childrens.id">
          <div
            class="center"
            @click="getto"
            v-for="item in childrens.children"
            :key="item.id"
          >
            <div class="img"></div>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, PropType } from "vue";
export interface ColumnProps {
  id: any;
  name: any;
}
export default defineComponent({
  name: "SideMenu",
  components: {},
  props: {
    list: Array as PropType<ColumnProps[]>,
  },
  setup(props) {
    const state = reactive({
      options: props,
      sctive: 0,
    });
    return toRefs(state);
  },
  data() {
    return { propsOptions: { label: "name", value: "id" } };
  },
  computed: {},
  methods: {
    getto() {
      console.log("跳转到新页面");
      window.open(
        "http://192.168.161.216:8088/superset/dashboard/world_health/?preselect_filters=%7B%7D&standalone=true&native_filters=%28%29",
        "_blank"
      ); // 新窗口打开外链接
    },
  },
});
</script>

<style lang="scss">
.mobileMenuwrap {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .topTitle {
    width: 100%;
    padding: 15px;
    background-color: rgb(236, 236, 236);
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
  width: 100px !important;
  .van-sidebar-item {
    --van-sidebar-padding: 15px var(--van-padding-sm);
  }
  .van-sidebar-item--select::before {
    height: 100% !important;
    background-color: #1e90ff !important;
  }
}

.siderBar {
  width: 100px !important;
  height: 100%;
  float: left;
  background-color: #f7f8fa;
}
</style>
