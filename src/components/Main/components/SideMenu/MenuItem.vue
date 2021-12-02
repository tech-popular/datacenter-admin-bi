<template>
  <div class="xfk-menu-item">
    <el-sub-menu v-if="item.children.length > 0" :index="item.id + ''">
      <template #title>
        <span>{{ item.name }}</span>
      </template>
      <menu-item
        v-for="children in item.children"
        :item="children"
        :key="children.id + ''"
      />
    </el-sub-menu>
    <el-menu-item v-if="item.children.length == 0" @click="menuClick(item.url)" :index="item.id + ''">
      <i :class="[item.icon]"></i>
      <span>{{ item.name }}</span>
    </el-menu-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "@/store/index";
export default defineComponent({
  name: "MenuItem",
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const store = useStore();
    const menuClick = (link: String) => {
      store.commit("changeDataLink", link);
    };

    return {
      menuClick,
    };
  },
});
</script>

<style lang="scss"></style>
