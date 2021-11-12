<template>
  <div class="iframeWrap">
    <iframe
      :src="dataLink"
      scrolling="auto"
      frameborder="0"
      class="frame"
      width="100%"
      height="100%"
    >
    </iframe>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store/index";
export default defineComponent({
  name: "Main",
  data() {
    return {
    };
  },
  setup() {
    const store = useStore();

    const dataLink: any = computed(() => {
      return store.state.curDataLink;
    });

    return {
      dataLink,
    };
  },
});
</script>

<style lang="scss">
.iframeWrap {
  width: 100%;
  height: 100%;
}
</style>
