// src/auth/storage.ts
// Step 2：Auth 存储工具（新手版）
//
// 这个文件是干嘛的？
// 👉 统一“存”和“拿”登录相关的数据
//
// 用什么存？
// 👉 sessionStorage
// - 只在当前浏览器 tab 有效
// - 关掉 tab 数据就没了
//
// 这个文件不做什么？
// - 不登录
// - 不跳转
// - 不算 PKCE

import type { CognitoTokenResponse } from "./token";
import type { CognitoUserInfo } from "./userInfo";

// -------------------------------
// 定义 storage 里用到的 key
// -------------------------------
const K_VERIFIER = "pkce_verifier";   // PKCE 原始字符串
const K_STATE = "oauth_state";        // OAuth 防攻击用的 state
const K_TOKEN = "oauth_token";        // 登录后的 token
const K_USERINFO = "oauth_userinfo";  // 用户信息缓存

// -------------------------------
// 登录前：保存临时数据
// -------------------------------
// 保存 PKCE verifier 和 state
// 登录开始前调用
export function saveOAuthTemp(input: { verifier: string; state: string }) {
  sessionStorage.setItem(K_VERIFIER, input.verifier);
  sessionStorage.setItem(K_STATE, input.state);
}

// -------------------------------
// 登录回调时：读取并立刻清掉
// -------------------------------
// 这些数据只用一次，用完就删
export function consumeOAuthTemp(): { verifier: string; state: string } {
  const verifier = sessionStorage.getItem(K_VERIFIER) || "";
  const state = sessionStorage.getItem(K_STATE) || "";

  sessionStorage.removeItem(K_VERIFIER);
  sessionStorage.removeItem(K_STATE);

  return { verifier, state };
}

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
// 保存用户信息（缓存）
// -------------------------------
export function saveOAuthUserInfo(info: CognitoUserInfo) {
  sessionStorage.setItem(K_USERINFO, JSON.stringify(info));
}

// -------------------------------
// 读取用户信息（缓存）
// -------------------------------
export function readOAuthUserInfo<T = CognitoUserInfo>(): T | null {
  const raw = sessionStorage.getItem(K_USERINFO);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// -------------------------------
// 登出时：清除数据
// -------------------------------
export function clearOAuthToken() {
  sessionStorage.removeItem(K_TOKEN);
  sessionStorage.removeItem(K_USERINFO);
}
