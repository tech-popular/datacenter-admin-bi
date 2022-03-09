<template>
  <div class="xfk-menu-item">
    <el-sub-menu v-if="item.children.length > 0" :index="item.id + ''">
      <template #title>
        <span>{{ item.name }}</span>
      </template>
      <menu-item v-for="children in item.children" :item="children" :key="children.id + ''" />
    </el-sub-menu>
    <el-menu-item v-if="item.children.length == 0" @click="menuClick(item)" :index="item.id + ''">
      <i :class="[item.icon]"></i>
      <span>{{ item.name }}</span>
    </el-menu-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    const menuClick = (item: any) => {
      console.log(item)
      switch (item.menuType) {
        case 0:
          store.commit('changeDataLink', item.url)
          store.commit('changeMenuType', item.menuType)
          router.push({
            path: '/home'
          })
          break
        case 1:
          router.push({
            path: `/report/${item.url}`
          })
          break
        case 2:
          router.push({
            path: `/tableau/${item.url}`
          })
          break
        default:
          store.commit('changeDataLink', '')
          router.push({
            path: '/home'
          })
      }
    }

    return {
      menuClick
    }
  }
})
</script>

<style lang="scss"></style>
