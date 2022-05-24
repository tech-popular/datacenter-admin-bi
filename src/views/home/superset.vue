<template>
  <div class="iframeWrap">
    <!-- <p class="wel" v-if="!dataLink">欢迎进入新BI系统</p> -->
    <iframe class="superset-iframe" :src="dataLink" scrolling="auto" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store/index'
export default defineComponent({
  name: 'Superset',
  data() {
    return {}
  },
  setup() {
    const store = useStore()

    const dataLink: any = computed(() => {
      return store.state.curDataLink
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

  .wel {
    text-align: center;
    padding-top: 25%;
    font-size: 45px;
    font-weight: 700;
    color: #333;
  }
  .superset-iframe {
    margin-top: -63px;
  }
}
</style>
