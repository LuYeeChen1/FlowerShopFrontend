<template>
  <main class="min-h-screen bg-slate-950 text-slate-100">
    <section class="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-24 text-center">
      <h1 class="text-3xl font-bold">正在处理回调</h1>
      <p class="text-slate-300">{{ statusMessage }}</p>
      <p v-if="errorMessage" class="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
        {{ errorMessage }}
      </p>
      <router-link
        class="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
        to="/"
      >
        返回首页
      </router-link>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { authContainer } from "../../infrastructure/composition/container";

const router = useRouter();
const statusMessage = ref("正在交换 token，请稍候...");
const errorMessage = ref("");

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  const errorDescription = params.get("error_description");

  if (error) {
    statusMessage.value = "回调返回错误。";
    errorMessage.value = errorDescription || error;
    return;
  }

  const code = params.get("code");
  const state = params.get("state");

  try {
    await authContainer.handleCallbackUseCase.execute({ code, state });
    statusMessage.value = "登录成功，正在跳转...";
    setTimeout(() => {
      router.replace("/");
    }, 600);
  } catch (error) {
    statusMessage.value = "回调处理失败。";
    errorMessage.value = error.message || "无法完成 token 交换。";
  }
});
</script>
