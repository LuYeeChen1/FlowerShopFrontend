<!-- src/pages/Me.vue -->
<template>
  <div class="p-6 space-y-4">
    <h1 class="text-xl font-semibold">Me</h1>

    <div v-if="status === 'loading'" class="text-sm">
      正在请求 /me...
    </div>

    <div v-else-if="status === 'error'" class="text-sm text-red-600">
      <div class="font-medium">失败</div>
      <pre class="whitespace-pre-wrap break-words mt-2">
{{ errorMessage }}
      </pre>
    </div>

    <div v-else class="text-sm">
      <div class="font-medium">成功</div>

      <details class="mt-4">
        <summary class="cursor-pointer">查看返回数据</summary>
        <pre class="whitespace-pre-wrap break-words mt-2">
{{ JSON.stringify(data, null, 2) }}
        </pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
// 作用：
// 1) 使用 authFetch("/me") 调后端（自动带 Bearer token）
// 2) 未登录 / token 失效 → 自动跳回首页（UX+）
//  Logout 已统一放在 AppLayout Header，这里不再处理

import { authFetch, clearOAuthToken } from "@/auth";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

type Status = "loading" | "ok" | "error";

const router = useRouter();

const status = ref<Status>("loading");
const errorMessage = ref("");
const data = ref<any>(null);

onMounted(async () => {
  try {
    const resp = await authFetch("/me");

    // 未授权：自动回首页（不展示错误）
    if (resp.status === 401 || resp.status === 403) {
      clearOAuthToken();
      router.replace("/");
      return;
    }

    // 其它非 2xx：作为错误展示
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`${resp.status} ${resp.statusText}: ${text}`);
    }

    data.value = await resp.json();
    status.value = "ok";
  } catch (e: any) {
    // authFetch 在无 token 时会抛错
    if (String(e?.message || e).includes("未登录")) {
      clearOAuthToken();
      router.replace("/");
      return;
    }

    status.value = "error";
    errorMessage.value = e?.message || String(e);
  }
});
</script>
