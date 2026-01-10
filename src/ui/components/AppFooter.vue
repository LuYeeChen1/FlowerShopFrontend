<template>
  <footer class="border-t border-slate-800 bg-slate-950/80">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <p>FlowerShop Cognito Demo</p>
      <div class="flex flex-col gap-1 text-slate-300 sm:items-end">
        <span>当前用户：{{ userEmail || "未登录" }}</span>
        <span>用户组：{{ userGroupsLabel }}</span>
      </div>
    </div>
  </footer>
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
