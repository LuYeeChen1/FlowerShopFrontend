<template>
  <main class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
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
          <p v-if="statusDetail" class="text-sm text-slate-400">
            {{ statusDetail }}
          </p>
          <p v-if="userEmail" class="text-sm text-emerald-200">
            {{ userEmail }}
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
            class="rounded-lg border border-rose-400/60 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/10"
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

    <section id="feature-menu" class="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          功能菜单
        </p>
        <h2 class="text-2xl font-semibold">顾客端功能一览</h2>
        <p class="text-sm text-slate-400">
          点击 Header 的菜单符号可快速跳转到这里。
        </p>
      </div>
      <div class="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
        <router-link
          v-for="item in featureMenuItems"
          :key="item.path"
          :to="item.path"
          class="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 transition hover:border-emerald-300 hover:text-emerald-200"
        >
          {{ item.label }}
        </router-link>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-2">
      <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <h2 class="text-lg font-semibold">Token 信息</h2>
        <div v-if="session" class="mt-3 space-y-2 text-sm text-slate-300">
          <p><span class="text-slate-400">Access Token：</span>{{ previewToken(session.accessToken) }}</p>
          <p><span class="text-slate-400">ID Token：</span>{{ previewToken(session.idToken) }}</p>
          <p><span class="text-slate-400">Refresh Token：</span>{{ previewToken(session.refreshToken) }}</p>
          <p><span class="text-slate-400">过期：</span>{{ session.isExpired() ? "已过期" : "有效" }}</p>
          <p v-if="userEmail"><span class="text-slate-400">用户邮箱：</span>{{ userEmail }}</p>
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
  </main>
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue";
import { authContainer } from "../../infrastructure/composition/container";
import { useCognitoUserInfo } from "../composables/useCognitoUserInfo";

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

const featureMenuItems = [
  { label: "身份与账户", path: "/customer/account" },
  { label: "个人资料管理", path: "/customer/profile" },
  { label: "地址簿管理", path: "/customer/address-book" },
  { label: "商品发现（浏览 / 搜索 / 筛选）", path: "/customer/catalog" },
  { label: "商品详情", path: "/customer/product-detail" },
  { label: "收藏 / 愿望清单", path: "/customer/wishlist" },
  { label: "购物车", path: "/customer/cart" },
  { label: "结算", path: "/customer/checkout" },
  { label: "订单管理", path: "/customer/orders" },
  { label: "支付", path: "/customer/payment" },
  { label: "物流查看", path: "/customer/shipment" },
  { label: "评价系统", path: "/customer/reviews" },
  { label: "售后（退款 / 退货 / 换货）", path: "/customer/after-sales" },
  { label: "优惠券", path: "/customer/coupons" },
  { label: "通知中心", path: "/customer/notifications" },
  { label: "客服工单", path: "/customer/support" },
];

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

const signOut = async () => {
  errorMessage.value = "";
  try {
    const url = await authContainer.signOutUseCase.execute();
    session.value = null;
    window.location.assign(url);
  } catch (error) {
    errorMessage.value = error.message || "无法完成退出。";
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
