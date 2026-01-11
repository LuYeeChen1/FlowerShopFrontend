<template>
  <div class="flex min-h-screen flex-col bg-slate-950 text-slate-100">
    <app-header :user-email="userEmail" :user-groups="userGroups" />

    <main class="flex-1">
      <router-view />
    </main>

    <app-footer :user-email="userEmail" :user-groups="userGroups" />
  </div>
</template>

<script setup>
import { computed, onMounted, provide, ref } from "vue";
import { authContainer } from "./infrastructure/composition/container";
import AppFooter from "./ui/components/AppFooter.vue";
import AppHeader from "./ui/components/AppHeader.vue";
import { useCognitoUserInfo } from "./ui/composables/useCognitoUserInfo";

const session = ref(null);

const refreshSession = () => {
  session.value = authContainer.getSessionUseCase.execute();
};

onMounted(() => {
  refreshSession();
});

const { email, groups } = useCognitoUserInfo(session);

const isAuthenticated = computed(
  () => !!session.value && !session.value.isExpired()
);
const userEmail = computed(() => email.value);
const userGroups = computed(() => groups.value);
const hasCustomerMenuAccess = computed(
  () => isAuthenticated.value && userGroups.value.includes("CUSTOMER")
);

provide("authSession", {
  session,
  refreshSession,
  isAuthenticated,
  hasCustomerMenuAccess,
  userEmail,
  userGroups,
});
</script>
