<template>
  <router-view />
</template>

<script lang="ts">
export default {
  name: "App",
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f7f9;
}
.app-container {
  padding: 10px;
}
</style>
