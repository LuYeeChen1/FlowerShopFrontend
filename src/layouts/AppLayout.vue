<!-- src/layouts/AppLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header 抽成组件：AppLayout 只负责“壳” -->
    <AppHeader />

    <!-- 内容区：由子路由页面渲染 -->
    <main class="mx-auto max-w-5xl px-6 py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// 作用：AppLayout 最终只保留“框架”
// - Header 交给 AppHeader
// - 页面内容交给 <router-view />

import AppHeader from "@/layouts/app/AppHeader.vue";
</script>
