<template>
  <main class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16 text-violet-100">
    <header class="space-y-3">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
        FlowerShop Auth
      </p>
      <h1 class="text-3xl font-bold sm:text-4xl">
        Cognito 认证入口
      </h1>
      <p class="text-base text-violet-200/80">
        通过 Hosted UI 完成认证，回调后在前端保存 token，供后续接入后端使用。
      </p>
    </header>

    <section class="rounded-2xl border border-violet-800/50 bg-violet-900/30 p-6 backdrop-blur-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-wide text-violet-400">当前状态</p>
          <p class="text-xl font-semibold">
            {{ statusLabel }}
          </p>
          <p v-if="statusDetail" class="text-sm text-violet-300/90">
            {{ statusDetail }}
          </p>
          <p v-if="userEmail" class="text-sm text-violet-200 font-medium mt-1">
            {{ userEmail }}
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500 focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-violet-900"
            type="button"
            @click="startAuth"
          >
            Start Authenticate
          </button>
        </div>
      </div>
      <p v-if="errorMessage" class="mt-4 rounded-lg border border-rose-500/40 bg-rose-950/30 px-4 py-2 text-sm text-rose-200">
        {{ errorMessage }}
      </p>
    </section>

    <section class="grid gap-4 sm:grid-cols-2">
      <section class="rounded-2xl border border-violet-800/50 bg-violet-900/30 p-5 backdrop-blur-sm">
        <h2 class="text-lg font-semibold">Token 信息</h2>
        <div v-if="session" class="mt-3 space-y-2 text-sm text-violet-200/80">
          <p><span class="text-violet-400">Access Token：</span>{{ previewToken(session.accessToken) }}</p>
          <p><span class="text-violet-400">ID Token：</span>{{ previewToken(session.idToken) }}</p>
          <p><span class="text-violet-400">Refresh Token：</span>{{ previewToken(session.refreshToken) }}</p>
          <p><span class="text-violet-400">过期：</span>{{ session.isExpired() ? "已过期" : "有效" }}</p>
          <p v-if="userEmail"><span class="text-violet-400">用户邮箱：</span>{{ userEmail }}</p>
        </div>
        <p v-else class="mt-3 text-sm text-violet-400">暂无 token，完成登录后将显示。</p>
      </section>

      <section class="rounded-2xl border border-violet-800/50 bg-violet-900/30 p-5 backdrop-blur-sm">
        <h2 class="text-lg font-semibold">流程说明</h2>
        <ol class="mt-3 list-decimal space-y-2 pl-5 text-sm text-violet-200/80">
          <li>点击“Start Authenticate”跳转至 Cognito Hosted UI。</li>
          <li>完成认证后跳转至 /callback，由前端交换 token。</li>
          <li>成功后 token 存入 localStorage，供后续 API 调用。</li>
        </ol>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue";
import { authContainer } from "../../infrastructure/composition/container";
import { useCognitoUserInfo } from "../composables/useCognitoUserInfo";

// Script 部分保持不变
const injectedSession = inject("authSession", null);
const session = injectedSession?.session ?? ref(null);
const refreshSession = injectedSession?.refreshSession;
const errorMessage = ref("");

const statusLabel = computed(() => {
  if (!session.value) {
    return "未登录";
  }
  return session.value.isExpired() ? "已过期" : "已登录";
});

const statusDetail = computed(() => {
  if (!session.value) {
    return "当前未检测到本地 token。";
  }
  if (session.value.isExpired()) {
    return "请重新登录以获取新的 token。";
  }
  return "token 已保存在 localStorage。";
});

const { email } = useCognitoUserInfo(session);
const userEmail = computed(() => email.value);

const previewToken = (token) => {
  if (!token) {
    return "-";
  }
  return `${token.slice(0, 20)}...${token.slice(-8)}`;
};

const startAuth = async () => {
  errorMessage.value = "";
  try {
    const url = await authContainer.startAuthUseCase.execute({ mode: "signIn" });
    window.location.assign(url);
  } catch (error) {
    errorMessage.value = error.message || "无法发起认证流程。";
  }
};

onMounted(() => {
  if (refreshSession) {
    refreshSession();
    return;
  }
  session.value = authContainer.getSessionUseCase.execute();
});
</script>