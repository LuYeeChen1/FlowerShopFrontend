// src/auth/storage/tokenStorage.ts
// Step 2：Auth 存储工具（新手版）
//
// 这个文件是干嘛的？
// 👉 统一“存”和“拿”登录后的 token

import type { CognitoTokenResponse } from "../request/tokenTypes";

// -------------------------------
// 定义 storage 里用到的 key
// -------------------------------
const K_TOKEN = "oauth_token";        // 登录后的 token
const K_USERINFO = "oauth_userinfo";  // 用户信息缓存

// -------------------------------
// 登录后：保存 token
// -------------------------------
// 注意点：
// - 有时不会返回 refresh_token → 要保留旧的
// - 记录获取时间，用来判断过期
// - token 更新时，顺便清掉旧 userInfo
export function saveOAuthToken(token: CognitoTokenResponse) {
  const old =
    readOAuthToken<(CognitoTokenResponse & { obtained_at?: number })>();

  const merged: CognitoTokenResponse & { obtained_at: number } = {
    ...(old ?? {}),
    ...(token ?? {}),
    refresh_token: token?.refresh_token ?? old?.refresh_token,
    obtained_at: Date.now(),
  };

  sessionStorage.setItem(K_TOKEN, JSON.stringify(merged));
  sessionStorage.removeItem(K_USERINFO);
}

// -------------------------------
// 读取 token
// -------------------------------
export function readOAuthToken<T = any>(): T | null {
  const raw = sessionStorage.getItem(K_TOKEN);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// -------------------------------
// 登出时：清除 token
// -------------------------------
export function clearOAuthToken() {
  sessionStorage.removeItem(K_TOKEN);
  sessionStorage.removeItem(K_USERINFO);
}
