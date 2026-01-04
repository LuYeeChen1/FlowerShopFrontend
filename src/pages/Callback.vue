<!-- src/pages/Callback.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-6">
    <div class="w-full max-w-md bg-white border rounded-xl p-6">
      <div class="text-sm font-semibold text-gray-900">Signing you in…</div>
      <div class="mt-2 text-sm text-gray-600">正在处理登录回调。</div>

      <div v-if="errorMessage" class="mt-4 text-sm text-red-600">
        <div class="font-medium">失败</div>
        <pre class="whitespace-pre-wrap break-words mt-2">{{ errorMessage }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 作用：OAuth 回调页（最薄）
// - 把所有逻辑交给 auth：handleOAuthCallback()
// - 成功：清理 URL + 跳转到 dashboard (/app/me)
// - 失败：显示错误

import { handleOAuthCallback } from "@/auth";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const errorMessage = ref("");

onMounted(async () => {
  try {
    await handleOAuthCallback(route.query as any);

    // 清理 URL（移除 code/state）
    await router.replace({ path: route.path, query: {} });

    // 进入 dashboard
    await router.replace("/app/me");
  } catch (e: any) {
    errorMessage.value = e?.message || String(e);
  }
});
</script>
