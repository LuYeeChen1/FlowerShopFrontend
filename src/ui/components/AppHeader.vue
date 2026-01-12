<template>
  <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
      <div class="flex items-center gap-4">
        <div class="relative">
          <button
            class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-200 transition hover:border-emerald-300 hover:text-emerald-200"
            type="button"
            aria-label="打开导航菜单"
            @click="toggleMenu"
          >
            <span class="text-xl leading-none">≡</span>
          </button>
          <div
            v-if="isMenuOpen"
            class="absolute left-0 top-12 z-20 w-64 rounded-xl border border-slate-800 bg-slate-950/95 p-3 text-xs text-slate-100 shadow-lg"
          >
            <p class="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              功能菜单
            </p>
            <div v-if="hasFeatureAccess" class="max-h-64 space-y-1 overflow-auto pr-1">
              <router-link
                v-for="item in featureMenuItems"
                :key="item.path"
                class="block rounded-lg px-3 py-2 font-semibold hover:bg-slate-900/80"
                :to="item.path"
                @click="closeMenu"
              >
                {{ item.label }}
              </router-link>
            </div>
            <p v-else class="px-3 py-2 text-slate-400">
              请先登录并加入 CUSTOMER 或 SELLER 组后查看功能菜单。
            </p>
            <div v-if="isAuthenticated" class="mt-2 border-t border-slate-800 pt-2">
              <button
                class="flex w-full items-center rounded-lg px-3 py-2 text-left font-semibold text-rose-100 transition hover:bg-rose-500/10"
                type="button"
                @click="signOut"
              >
                Logout
              </button>
              <p v-if="errorMessage" class="px-3 pt-2 text-xs text-rose-200">
                {{ errorMessage }}
              </p>
            </div>
          </div>
        </div>
        <button
          class="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-emerald-300 hover:text-emerald-200"
          type="button"
          @click="handleBack"
        >
          ← 返回
        </button>
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          FlowerShop
        </p>
        <p class="text-lg font-semibold">Cognito Portal</p>
      </div>
      <div class="text-right text-sm text-slate-300">
        <p v-if="userEmail" class="font-medium text-slate-100">Email：{{ userEmail }}</p>
        <p>
          Group：
          <span class="text-slate-100">{{ userGroupsLabel }}</span>
        </p>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import { useRouter } from "vue-router";
import { authContainer } from "../../infrastructure/composition/container";

const props = defineProps({
  userEmail: {
    type: String,
    default: "",
  },
  userGroups: {
    type: Array,
    default: () => [],
  },
});

const userGroupsLabel = computed(() => {
  if (!props.userGroups.length) {
    return "无";
  }
  return props.userGroups.join(", ");
});

const router = useRouter();
const injectedSession = inject("authSession", null);
const session = injectedSession?.session ?? ref(null);
const isMenuOpen = ref(false);
const errorMessage = ref("");

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const hasFeatureAccess = computed(() => {
  if (!props.userGroups.length) {
    return false;
  }
  return props.userGroups.some((group) => ["CUSTOMER", "SELLER"].includes(group));
});

const isAuthenticated = computed(() => {
  return Boolean(session.value && !session.value.isExpired());
});

const featureMenuItems = [
  { label: "身份与账户", path: "/account" },
  { label: "个人资料管理", path: "/profile" },
  { label: "地址簿管理", path: "/address-book" },
  { label: "商品发现（浏览 / 搜索 / 筛选）", path: "/catalog" },
  { label: "商品详情", path: "/product-detail" },
  { label: "收藏 / 愿望清单", path: "/wishlist" },
  { label: "购物车", path: "/cart" },
  { label: "结算", path: "/checkout" },
  { label: "订单管理", path: "/orders" },
  { label: "支付", path: "/payment" },
  { label: "物流查看", path: "/shipment" },
  { label: "评价系统", path: "/reviews" },
  { label: "售后（退款 / 退货 / 换货）", path: "/after-sales" },
  { label: "优惠券", path: "/coupons" },
  { label: "通知中心", path: "/notifications" },
  { label: "客服工单", path: "/support" },
];

const signOut = async () => {
  errorMessage.value = "";
  try {
    const url = await authContainer.signOutUseCase.execute();
    session.value = null;
    closeMenu();
    window.location.assign(url);
  } catch (error) {
    errorMessage.value = error.message || "无法完成退出。";
  }
};

const handleBack = () => {
  const previousPath = router.options.history.state?.back;
  const blockedPaths = new Set(["/signed-out", "/callback"]);
  if (previousPath && !blockedPaths.has(previousPath)) {
    router.back();
    return;
  }
  router.push("/");
};
</script>
