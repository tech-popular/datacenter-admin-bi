<template>
  <div class="iframeWrap">
    <iframe :src="dataLink" scrolling="auto" frameborder="0" class="frame" width="100%" height="100%"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { getTableauInfo } from '@/api/api'

export default defineComponent({
  setup() {
    const route: RouteLocationNormalized = useRoute()

    const dataLink = ref('')
    const modelId: string = String(route.params.modelId)

    getTableauInfo(modelId).then(res => {
      if (res.code === 500) {
        return
      } else {
        dataLink.value = String(res.url)
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