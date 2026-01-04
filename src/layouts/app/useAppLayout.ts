// src/layouts/app/useAppLayout.ts
// 作用：把 AppLayout 的逻辑抽出去，让 AppLayout.vue 只保留 UI（最薄）

import { clearOAuthToken, readOAuthToken } from "@/auth";
import { decodeJwtPayload } from "@/utils/jwt";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { APP_NAV } from "./nav";

export function useAppLayout() {
  const router = useRouter();
  const route = useRoute();

  // 移动端菜单开关
  const mobileOpen = ref(false);

  // 导航定义（集中在 nav.ts）
  const nav = APP_NAV;

  // 判断当前路由高亮（支持子路由）
  function isActive(path: string) {
    return route.path === path || route.path.startsWith(path + "/");
  }

  // 仅用于 UI 展示：从 token 解码出 email/username/sub
  const userLabel = computed(() => {
    const token: any = readOAuthToken<any>();
    const jwt = token?.id_token || token?.access_token;
    if (!jwt) return "";

    const payload = decodeJwtPayload(jwt);
    if (!payload) return "";

    if (payload.email) return String(payload.email);
    if (payload["cognito:username"]) return String(payload["cognito:username"]);
    if (payload.username) return String(payload.username);
    if (payload.sub) return `sub: ${String(payload.sub).slice(0, 8)}…`;

    return "";
  });

  // Logout：清 token + 回到登录页
  function logout() {
    clearOAuthToken();
    mobileOpen.value = false;
    router.replace("/");
  }

  return {
    mobileOpen,
    nav,
    isActive,
    userLabel,
    logout,
  };
}
