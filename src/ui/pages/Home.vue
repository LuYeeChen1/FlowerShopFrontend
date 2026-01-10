<template>
  <main class="min-h-screen bg-slate-950 text-slate-100">
    <section class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
      <header class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          FlowerShop Auth
        </p>
        <h1 class="text-3xl font-bold sm:text-4xl">
          Cognito 认证入口
        </h1>
        <p class="text-base text-slate-300">
          通过 Hosted UI 完成认证，回调后在前端保存 token，供后续接入后端使用。
        </p>
      </header>

      <section class="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm uppercase tracking-wide text-slate-400">当前状态</p>
            <p class="text-xl font-semibold">
              {{ statusLabel }}
            </p>
            <p v-if="userEmail" class="text-sm text-emerald-200">
              {{ userEmail }}
            </p>
            <p v-if="statusDetail" class="text-sm text-slate-400">
              {{ statusDetail }}
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button
              class="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400"
              type="button"
              @click="startAuth"
            >
              Start Authenticate
            </button>
            <button
              v-if="session"
              class="rounded-lg border border-rose-400/70 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/20"
              type="button"
              @click="signOut"
            >
              Logout
            </button>
          </div>
        </div>
        <p v-if="errorMessage" class="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
          {{ errorMessage }}
        </p>
      </section>

      <section class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 class="text-lg font-semibold">Token 信息</h2>
          <div v-if="session" class="mt-3 space-y-2 text-sm text-slate-300">
            <p><span class="text-slate-400">Access Token：</span>{{ previewToken(session.accessToken) }}</p>
            <p><span class="text-slate-400">ID Token：</span>{{ previewToken(session.idToken) }}</p>
            <p><span class="text-slate-400">Refresh Token：</span>{{ previewToken(session.refreshToken) }}</p>
            <p><span class="text-slate-400">过期：</span>{{ session.isExpired() ? "已过期" : "有效" }}</p>
          </div>
          <p v-else class="mt-3 text-sm text-slate-400">暂无 token，完成登录后将显示。</p>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 class="text-lg font-semibold">流程说明</h2>
          <ol class="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
            <li>点击“Start Authenticate”跳转至 Cognito Hosted UI。</li>
            <li>完成认证后跳转至 /callback，由前端交换 token。</li>
            <li>成功后 token 存入 localStorage，供后续 API 调用。</li>
          </ol>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { authContainer } from "../../infrastructure/composition/container";

const session = ref(null);
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

const decodeJwtPayload = (token) => {
  if (!token) {
    return null;
  }
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  try {
    return JSON.parse(atob(padded));
  } catch (error) {
    return null;
  }
};

const userEmail = computed(() => {
  if (!session.value) {
    return "";
  }
  const payload = decodeJwtPayload(session.value.idToken);
  return payload?.email || "";
});

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

const signOut = () => {
  errorMessage.value = "";
  try {
    const logoutUrl = authContainer.signOutUseCase.execute();
    window.location.assign(logoutUrl);
  } catch (error) {
    errorMessage.value = error.message || "无法退出登录。";
  }
};

onMounted(() => {
  session.value = authContainer.getSessionUseCase.execute();
});
</script>
