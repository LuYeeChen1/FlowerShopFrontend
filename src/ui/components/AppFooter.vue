<template>
  <footer class="border-t border-slate-800 bg-slate-950/80">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <p>Flower Shop</p>
      <div class="flex flex-col gap-2 text-slate-300 sm:items-end">
        <div class="flex flex-col gap-1">
          <span>当前用户：{{ userEmail || "未登录" }}</span>
          <span>用户组：{{ userGroupsLabel }}</span>
        </div>
        <button
          v-if="isAuthenticated"
          class="w-fit rounded-lg border border-rose-400/60 px-3 py-1.5 text-xs font-semibold text-rose-100 hover:bg-rose-500/10"
          type="button"
          @click="signOut"
        >
          Logout
        </button>
        <span v-if="errorMessage" class="text-xs text-rose-200">
          {{ errorMessage }}
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, inject, ref } from "vue";
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

const injectedSession = inject("authSession", null);
const session = injectedSession?.session ?? ref(null);
const errorMessage = ref("");

const isAuthenticated = computed(() => {
  return Boolean(session.value && !session.value.isExpired());
});

const userGroupsLabel = computed(() => {
  if (!props.userGroups.length) {
    return "无";
  }
  return props.userGroups.join(", ");
});

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
</script>
