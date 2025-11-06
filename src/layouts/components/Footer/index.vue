<template>
  <div class="footer flx-center">
    <a href="https://szadmin.cn" target="_blank">
      v{{ version }} | Copyright © 2025-{{ new Date().getFullYear() }} 苍南钱库高级中学
    </a>
  </div>
</template>
<script setup lang="ts">
const version: string = __APP_VERSION__;
</script>
<style scoped lang="scss">
@use './index';
</style>
