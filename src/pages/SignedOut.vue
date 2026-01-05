<!-- src/pages/SignedOut.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-6">
    <div class="w-full max-w-md bg-white border rounded-xl p-6 text-center">
      <h1 class="text-lg font-semibold text-gray-900">
        Signed out
      </h1>

      <p class="mt-2 text-sm text-gray-600">
        You have been successfully signed out.
      </p>

      <router-link
        to="/"
        class="inline-block mt-6 px-4 py-2 rounded bg-blue-600 text-white text-sm"
      >
        Back to login
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 作用：
// - Cognito logout redirect 的落地页
// - 不处理 token（token 已在 logout 时清掉）
// - 只负责 UX
</script>
