<template>
  <div class="xfk-menu-item">
    <el-sub-menu v-if="item.children" :index="item.id + ''">
      <template #title>
        <span class="span-ellipsis" :title="item.name" :style="{'font-size': (18 - item.grade-1) + 'px', 'color':textColor[item.grade] }">{{ item.name }}</span>
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
    const textColor = ref([
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#e3abb3',
      '#9d7796',
      '#936fcd'
    ])
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
      textColor
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
  padding-left: 20px !important;
  font-size: 12px;
  color: #b7ebeb;
}
.el-sub-menu__title {
  padding-left: 20px !important;
}
</style>
