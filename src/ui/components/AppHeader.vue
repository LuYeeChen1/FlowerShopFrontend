<template>
  <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
      <div class="flex items-center gap-4">
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
            class="absolute left-0 top-12 z-20 w-44 rounded-xl border border-slate-800 bg-slate-950/95 p-2 text-xs text-slate-100 shadow-lg"
          >
            <router-link
              class="block rounded-lg px-3 py-2 font-semibold hover:bg-slate-900/80"
              to="/"
              @click="closeMenu"
            >
              Home
            </router-link>
            <button
              class="flex w-full items-center rounded-lg px-3 py-2 text-left font-semibold transition hover:bg-slate-900/80 disabled:cursor-not-allowed disabled:text-slate-500"
              type="button"
              :disabled="!canOpenMenu"
              @click="handleMenuClick"
            >
              功能菜单
            </button>
          </div>
        </div>
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
import { computed, inject, nextTick, ref } from "vue";
import { useRouter } from "vue-router";

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
const customerMenuState = inject("customerMenuState", null);
const canOpenMenu = computed(() => customerMenuState?.hasAccess?.value ?? false);
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const scrollToFeatureMenu = () => {
  const target = document.getElementById("feature-menu");
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const handleMenuClick = async () => {
  if (router.currentRoute.value.path !== "/") {
    await router.push("/");
  }
  if (!canOpenMenu.value) {
    return;
  }
  if (customerMenuState?.open) {
    customerMenuState.open();
  }
  await nextTick();
  scrollToFeatureMenu();
  closeMenu();
};

const handleBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }
  router.push("/");
};
</script>
