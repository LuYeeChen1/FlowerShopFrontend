// src/layouts/app/useAppLayout.ts
// Step C：AppLayout 逻辑集中管理（新手版）
//
// 这个文件是干嘛的？
// 👉 把 AppLayout 的“逻辑”抽出来
// 👉 AppLayout.vue 只负责画 UI
//
// 这里主要负责：
// - 导航数据
// - 当前用户显示名
// - 初次进入时拉用户信息
// - Logout 行为

import { clearOAuthToken, readOAuthToken } from "@/auth";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { APP_NAV } from "./nav";

import { CLIENT_ID, COGNITO_DOMAIN, LOGOUT_REDIRECT_URI } from "@/auth/config/cognito";
import type { CognitoTokenResponse } from "@/auth/request/tokenTypes";

import { labelFromJwt, labelFromUserInfo } from "@/auth/display/userLabel";
import { readOAuthUserInfo, saveOAuthUserInfo } from "@/auth/storage";
import { fetchUserInfo, type CognitoUserInfo } from "@/auth/userInfo";

// storage 里读出来的 token 结构
type StoredToken = CognitoTokenResponse & {
  obtained_at?: number;
};

// labelFromUserInfo / labelFromJwt 已抽到 display/userLabel.ts

// -------------------------------
// AppLayout 对外使用的组合函数
// -------------------------------
const mobileOpen = ref(false);
const nav = APP_NAV;
const userInfo = ref<CognitoUserInfo | null>(readOAuthUserInfo());
const hasFetchedUserInfo = ref(false);

export function useAppLayout() {
  const route = useRoute();

  // 当前路由是否高亮
  function isActive(path: string) {
    return route.path === path || route.path.startsWith(path + "/");
  }

  // 页面右上角显示的用户名
  const userLabel = computed(() => {
    // 先用 userInfo
    const fromInfo = labelFromUserInfo(userInfo.value);
    if (fromInfo) return fromInfo;

    // 再用 JWT 解码兜底
    const token = readOAuthToken<StoredToken>();
    return labelFromJwt(token);
  });

  // 第一次进入 AppLayout 时
  // 如果没有 userInfo 缓存，就去 Cognito 拉一次
  onMounted(async () => {
    if (hasFetchedUserInfo.value) return;
    hasFetchedUserInfo.value = true;

    if (userInfo.value) return;

    const token = readOAuthToken<StoredToken>();
    const accessToken = token?.access_token;
    if (!accessToken) return;

    try {
      const info = await fetchUserInfo(accessToken);
      userInfo.value = info;
      saveOAuthUserInfo(info);
    } catch {
      // 拉失败就算了，不影响页面
    }
  });

  // -------------------------------
  // Logout：Cognito Hosted UI 全局登出
  // -------------------------------
  function logout() {
    // 清本地 token
    clearOAuthToken();
    mobileOpen.value = false;
    userInfo.value = null;

    // 跳转到 Cognito 的全局登出
    const domain = COGNITO_DOMAIN.replace(/\/$/, "");
    const logoutUrl =
      `${domain}/logout` +
      `?client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&logout_uri=${encodeURIComponent(LOGOUT_REDIRECT_URI)}`;

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
