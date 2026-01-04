<!-- src/pages/Auth.vue -->
<script setup lang="ts">
// 统一认证入口：跳转到 Cognito Hosted UI
import { login } from "@/auth";
</script>

<template>
  <!-- 全屏居中容器 -->
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <!-- 卡片 -->
    <div class="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
      <!-- 标题 -->
      <h1 class="mb-2 text-center text-2xl font-semibold text-gray-900">
        FlowerShop
      </h1>

      <!-- 描述 -->
      <p class="mb-6 text-center text-sm text-gray-500">
        Authentication is handled by Amazon Cognito
      </p>

      <!-- Cognito 认证按钮 -->
      <button
        @click="login"
        class="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white
               hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900
               focus:ring-offset-2"
      >
        Auth with Cognito
      </button>
    </div>
  </div>
</template>
