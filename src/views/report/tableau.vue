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
    // const modelId: string = String(route.params.modelId)
    if (route.params.modelId == 999) {
      getTableauPage().then(res => {
        if (res.code === 0) {
          dataLink.value = String(res.url)
        } else {
          return ElMessage(res.msg)
        }
      })
    } else {
      const tableauId: string = menulistData.filter(
        item => item.url === route.params.modelId
      )[0].tableauId
      if (tableauId === 0) return
      getTableauInfo(tableauId).then(res => {
        if (res.code === 0) {
          dataLink.value = String(res.url)
        } else {
          return ElMessage(res.msg)
        }
      })
    }

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