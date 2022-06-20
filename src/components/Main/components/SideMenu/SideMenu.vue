<template>
  <el-menu
    class="xfk-side-menu"
    :background-color="backgroundColor"
    :collapse="sidebarFold"
    :collapseTransition="false"
    :text-color="textColor"
    :active-text-color="activeTextColor"
    :default-active="defaultActive || 'home'"
  >
    <menu-item v-for="item in list" :key="item.id" :item="item" />
  </el-menu>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import MenuItem from './MenuItem.vue'
import { useStore } from '@/store/index'
import { useRoute } from 'vue-router'
export interface ColumnProps {
  id: any
}

export default defineComponent({
  name: 'SideMenu',
  components: { MenuItem },
  props: {
    list: Array as PropType<ColumnProps[]>,
    defaultActive: String,
    backgroundColor: String,
    textColor: String,
    activeTextColor: String,
    isMobile: Boolean
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const defaultActive: any = route.path
    store.commit('updateDefaultActive', defaultActive)
    const sidebarFold: any = computed(() => {
      return store.state.sidebarFold
    })
    return {
      sidebarFold,
      defaultActive,
      route
    }
  }
})
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
