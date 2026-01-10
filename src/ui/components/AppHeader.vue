<template>
  <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
      <div>
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
</script>
