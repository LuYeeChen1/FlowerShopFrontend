// src/layouts/app/useAppLayout.ts
// 作用：把 AppLayout 的逻辑抽出去，让 AppLayout.vue 只保留 UI（最薄）
//
// 更新点：
// 1) userLabel 优先使用缓存的 userInfo（/oauth2/userInfo）
// 2) 没有缓存 userInfo 时：用 access_token 调 Cognito userInfo，并写入缓存
// 3) 若 userInfo 拉取失败：fallback 到 decode id_token/access_token
// 4) Logout：清本地 token + Cognito Hosted UI Global Sign-Out

import { clearOAuthToken, readOAuthToken } from "@/auth";
import { decodeJwtPayload } from "@/utils/jwt";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { APP_NAV } from "./nav";

import { CLIENT_ID, COGNITO_DOMAIN, REDIRECT_URI } from "@/auth/config";
import type { CognitoTokenResponse } from "@/auth/token";

import { readOAuthUserInfo, saveOAuthUserInfo } from "@/auth/storage";
import { fetchUserInfo, type CognitoUserInfo } from "@/auth/userInfo";

type StoredToken = CognitoTokenResponse & {
  obtained_at?: number;
};

function labelFromUserInfo(info: CognitoUserInfo | null): string {
  if (!info) return "";

  if (info.email) return String(info.email);
  if (info.name) return String(info.name);
  if (info.preferred_username) return String(info.preferred_username);
  if (info.username) return String(info.username);
  if (info.sub) return `sub: ${String(info.sub).slice(0, 8)}…`;

  return "";
}

function labelFromJwt(token: StoredToken | null): string {
  const jwt = token?.id_token || token?.access_token;
  if (!jwt) return "";

  const payload: any = decodeJwtPayload(jwt);
  if (!payload) return "";

  if (payload.email) return String(payload.email);
  if (payload.name) return String(payload.name);
  if (payload.preferred_username) return String(payload.preferred_username);
  if (payload["cognito:username"]) return String(payload["cognito:username"]);
  if (payload.username) return String(payload.username);
  if (payload.sub) return `sub: ${String(payload.sub).slice(0, 8)}…`;

  return "";
}

export function useAppLayout() {
  const route = useRoute();

  // 移动端菜单开关
  const mobileOpen = ref(false);

  // 导航定义（集中在 nav.ts）
  const nav = APP_NAV;

  // 判断当前路由高亮（支持子路由）
  function isActive(path: string) {
    return route.path === path || route.path.startsWith(path + "/");
  }

  // 缓存的 userInfo（优先用于展示）
  const userInfo = ref<CognitoUserInfo | null>(readOAuthUserInfo());

  // UI 展示 label：优先 userInfo，其次 JWT decode
  const userLabel = computed(() => {
    const fromInfo = labelFromUserInfo(userInfo.value);
    if (fromInfo) return fromInfo;

    const token = readOAuthToken<StoredToken>();
    return labelFromJwt(token);
  });

  // 初次进入 AppLayout：如果没有 userInfo 缓存且已登录，就去 Cognito 拉一次
  onMounted(async () => {
    if (userInfo.value) return;

    const token = readOAuthToken<StoredToken>();
    const accessToken = token?.access_token;
    if (!accessToken) return;

    try {
      const info = await fetchUserInfo(accessToken);
      userInfo.value = info;
      saveOAuthUserInfo(info);
    } catch {
      // 拉不到就算了：保持 fallback（不要阻塞页面）
    }
  });

  // Logout：清 token + Cognito Hosted UI Global Sign-Out
  function logout() {
    clearOAuthToken();
    mobileOpen.value = false;

    const logoutUrl =
      `${COGNITO_DOMAIN}/logout` +
      `?client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&logout_uri=${encodeURIComponent(REDIRECT_URI)}`;

    window.location.assign(logoutUrl);
  }

  return {
    mobileOpen,
    nav,
    isActive,
    userLabel,
    logout,
  };
}
