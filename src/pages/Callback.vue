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
// - handleOAuthCallback()：换 token + 存 token
// - 成功后：立刻 fetchUserInfo(access_token) 并缓存（让 AppLayout 立刻显示 email）
// - 成功：清理 URL + 跳转到 dashboard (/app/me)
// - 失败：显示错误

import {
  fetchUserInfo,
  handleOAuthCallback,
  readOAuthToken,
  saveOAuthUserInfo,
} from "@/auth";
import type { CognitoTokenResponse } from "@/auth/token";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const errorMessage = ref("");

onMounted(async () => {
  try {
    // 1) 换 token + 存 token
    await handleOAuthCallback(route.query as any);

    // 2) 立刻拉 userInfo 并缓存（不阻塞登录流程：拉不到就忽略）
    const token = readOAuthToken<CognitoTokenResponse>();
    const accessToken = token?.access_token;

    if (accessToken) {
      try {
        const info = await fetchUserInfo(accessToken);
        saveOAuthUserInfo(info);
      } catch {
        // ignore：AppLayout 还有 JWT fallback，不要因为 userInfo 拉取失败就挡住登录
      }
    }

    // 3) 清理 URL（移除 code/state）
    await router.replace({ path: route.path, query: {} });

    // 4) 进入 dashboard
    await router.replace("/app/me");
  } catch (e: any) {
    errorMessage.value = e?.message || String(e);
  }
});
</script>
