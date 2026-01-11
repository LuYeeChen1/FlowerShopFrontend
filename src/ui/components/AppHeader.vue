<template>
  <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
      <div class="flex items-center gap-4">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          FlowerShop
        </p>
        <p class="text-lg font-semibold">Cognito Portal</p>
        <button
          class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-200 transition hover:border-emerald-300 hover:text-emerald-200"
          type="button"
          aria-label="查看功能菜单"
          @click="scrollToFeatureMenu"
        >
          <span class="text-xl leading-none">≡</span>
        </button>
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
import { computed } from "vue";

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

const scrollToFeatureMenu = () => {
  const target = document.getElementById("feature-menu");
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
</script>
