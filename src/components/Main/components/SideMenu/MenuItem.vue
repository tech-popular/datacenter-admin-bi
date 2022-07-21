<template>
  <div class="xfk-menu-item">
    <el-sub-menu v-if="item.children" :index="item.id + ''">
      <template #title>
        <span class="span-ellipsis-title" :title="item.name" :style="{'font-size': (18 - item.grade-1) + 'px','background':textColor[item.grade-2]} ">{{ item.name }}</span>
      </template>
      <menu-item v-for="children in item.children" :item="children" :key="children.id + ''" />
    </el-sub-menu>
    <el-menu-item v-if="!item.children" @click="menuClick(item)" :index="item.id + ''">
      <i :class="[item.icon]"></i>
      <span class="span-ellipsis" :title="item.name">{{ item.name }}</span>
    </el-menu-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store/index'
export default defineComponent({
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const textColor = ref(['#222d32', '#514e55', '#655e72', '#7b708c'])
    const hoverColor = ref(['#4cb352', '#5bc2d3', '#ffc23f', 'pink', '#872822'])
    const menuClick = (item: any) => {
      console.log(item)
      switch (item.menuType) {
        case 0:
          store.commit('changeDataLink', item.url)
          store.commit('changeMenuType', item.menuType)
          store.commit('changeMenuName', '')
          router.push({
            path: `/superset/${item.id}`
          })
          break
        case 1:
          const menulistData = JSON.parse(sessionStorage.getItem('menulist'))
          store.commit(
            'changeMenuName',
            menulistData.filter(citem => citem.id === item.id)[0].menuRelevance
          )
          router.push({
            path: `/report/${item.url}`
          })
          break
        case 2:
          store.commit('changeMenuName', '')
          router.push({
            path: `/tableau/${item.url}`
          })
          break
        default:
          store.commit('changeMenuName', '')
          store.commit('changeDataLink', '')
          router.push({
            path: '/home'
          })
      }
    }

    return {
      menuClick,
      textColor,
      hoverColor
    }
  }
})
</script>

<style lang="scss">
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block; // 一定要是块级元素，并且有定宽才有效果
}
.el-menu-item {
  font-size: 12px;
  background-color: #818081;
  padding-left: 20px !important;
}
.el-menu-item:hover {
  background-color: #b3aebb;
}
.el-menu-item.is-active {
  background-color: #3c8dbc;
}
.el-sub-menu__title {
  padding: 0px !important;
}
.el-sub-menu__title:hover {
  background-color: #b3aebb !important;
}
.span-ellipsis-title {
  width: 100%;
  height: 100%;
  line-height: 56px !important;
  padding-left: 20px !important;
}
.span-ellipsis-title:hover {
  background-color: #b3aebb !important;
}
</style>
