<template>
  <el-menu
    class="xfk-side-menu"
    :background-color="backgroundColor"
    :text-color="textColor"
    :active-text-color="activeTextColor"
    :default-active="defaultActive"
  >
    <menu-item v-for="item in list" :key="item.id" :item="item" />
  </el-menu>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import MenuItem from "./MenuItem.vue";

export interface ColumnProps {
  id: any;
}

export default defineComponent({
  name: "SideMenu",
  components: { MenuItem },
  props: {
    list : Array as PropType<ColumnProps[]>,
    defaultActive: String,
    backgroundColor: String,
    textColor: String,
    activeTextColor: String,
    isMobile: Boolean,
  },
});
</script>

<style lang="scss">
.xfk-side-menu {
  border-right: none !important;
  user-select: none;
  span {
    line-height: 1.5em;
  }
  .iconfont {
    margin-right: 5px;
    font-size: 18px;
    vertical-align: -0.15em;
  }
  .xfk-menu-link {
    display: block;
    text-decoration: none;
  }
}
</style>
