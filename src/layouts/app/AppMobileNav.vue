<!-- src/layouts/app/AppMobileNav.vue -->
<template>
  <!-- 移动端导航展开区 -->
  <div v-if="mobileOpen" class="sm:hidden border-t bg-white">
    <div class="mx-auto max-w-5xl px-6 py-2 flex flex-col gap-1">
      <!-- 移动端也显示用户 -->
      <div v-if="userLabel" class="px-3 py-2 text-xs text-gray-500">
        {{ userLabel }}
      </div>

      <RouterLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        class="px-3 py-2 rounded-md text-sm"
        :class="isActive(item.to)
          ? 'bg-gray-900 text-white'
          : 'text-gray-700 hover:bg-gray-100'"
        @click="mobileOpen = false"
      >
        {{ item.label }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// 作用：移动端菜单组件
// - 复用 useAppLayout() 的状态与导航数据
// - 点击任一导航后自动收起菜单

import { useAppLayout } from "@/layouts/app/useAppLayout";

const { mobileOpen, nav, isActive, userLabel } = useAppLayout();
</script>
