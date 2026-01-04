<!-- src/layouts/app/AppHeader.vue -->
<template>
  <!-- 顶部 Header：统一导航栏（已登录态） -->
  <header class="border-b bg-white sticky top-0 z-30">
    <div
      class="mx-auto max-w-5xl px-6 py-4
             flex items-center justify-between gap-3"
    >
      <!-- 左侧：应用名 + 当前用户 -->
      <div class="flex items-center gap-3">
        <!-- 移动端：菜单按钮 -->
        <button
          class="sm:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border text-gray-700 hover:bg-gray-50"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 6h14a1 1 0 010 2H3a1 1 0 110-2zm0 6h14a1 1 0 010 2H3a1 1 0 110-2z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <!-- 应用名（点一下回到 Me；并收起移动菜单） -->
        <RouterLink
          to="/me"
          class="text-sm font-semibold text-gray-900 hover:opacity-80"
          @click="mobileOpen = false"
        >
          FlowerShop
        </RouterLink>

        <!-- 当前登录用户（仅展示用） -->
        <div v-if="userLabel" class="hidden sm:block text-xs text-gray-500">
          {{ userLabel }}
        </div>
      </div>

      <!-- 中间：桌面端导航 -->
      <nav class="hidden sm:flex items-center gap-1">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="px-3 py-2 rounded-md text-sm"
          :class="isActive(item.to)
            ? 'bg-gray-900 text-white'
            : 'text-gray-700 hover:bg-gray-100'"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <!-- 右侧：统一 Logout -->
      <button
        class="px-3 py-1.5 rounded bg-red-600 text-white text-sm hover:bg-red-700"
        @click="logout"
      >
        Logout
      </button>
    </div>

    <!-- 移动端菜单：抽成独立组件 -->
    <AppMobileNav />
  </header>
</template>

<script setup lang="ts">
// 作用：Header 变薄
// - 桌面导航 + 顶部按钮保留
// - 移动端菜单交给 AppMobileNav

import AppMobileNav from "@/layouts/app/AppMobileNav.vue";
import { useAppLayout } from "@/layouts/app/useAppLayout";

const { mobileOpen, nav, isActive, userLabel, logout } = useAppLayout();
</script>
