<template>
  <div class="iframeWrap">
    <iframe :src="dataLink" scrolling="auto" frameborder="0" class="frame" width="100%" height="100%"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { getTableauInfo, getTableauPage } from '@/api/api'
import { ElMessage } from 'element-plus'
export default defineComponent({
  setup() {
    const route: RouteLocationNormalized = useRoute()
    const menulistData = JSON.parse(sessionStorage.getItem('menulist'))
    const dataLink = ref('')
    const tableauData = menulistData.filter(
      item => item.id == route.params.id
    )[0]
    console.log('tableauData: ', tableauData)
    // const menuId: string = String(route.params.id)
    if (tableauData.tableauType === 0 && tableauData.tableauId === 0) return
    const currentHost = window.location.origin
    console.log('currentHost: ', currentHost)
    const params = {
      id: route.params.id,
      host: currentHost
    }
    getTableauPage(params).then(res => {
      if (res.code === 0) {
        dataLink.value = String(res.url)
      } else {
        return ElMessage(res.msg)
      }
    })
    return {
      dataLink
    }
  }
})
</script>

<style lang="scss">
.iframeWrap {
  width: 100%;
  height: 100%;
}
</style>