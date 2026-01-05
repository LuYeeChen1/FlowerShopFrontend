// src/auth/storage.ts
// 作用：统一管理 OAuth 临时数据 & token & userInfo 的存储
// 使用 sessionStorage（tab 级别；关闭 tab 才会丢）

import type { CognitoTokenResponse } from "./token";
import type { CognitoUserInfo } from "./userInfo";

const K_VERIFIER = "pkce_verifier";
const K_STATE = "oauth_state";
const K_TOKEN = "oauth_token";
const K_USERINFO = "oauth_userinfo";

// 保存 PKCE verifier + OAuth state（登录前）
export function saveOAuthTemp(input: { verifier: string; state: string }) {
  sessionStorage.setItem(K_VERIFIER, input.verifier);
  sessionStorage.setItem(K_STATE, input.state);
}

// 读取并清除（一次性消费）
export function consumeOAuthTemp(): { verifier: string; state: string } {
  const verifier = sessionStorage.getItem(K_VERIFIER) || "";
  const state = sessionStorage.getItem(K_STATE) || "";

  sessionStorage.removeItem(K_VERIFIER);
  sessionStorage.removeItem(K_STATE);

  return { verifier, state };
}

// 保存 token（登录 / 刷新时调用）
// 关键点：
// 1) refresh grant 可能不返回 refresh_token → 保留旧的
// 2) 记录 obtained_at（毫秒）
// 3) token 更新时，顺便清掉旧 userInfo（避免展示过期数据）
export function saveOAuthToken(token: CognitoTokenResponse) {
  const old = readOAuthToken<(CognitoTokenResponse & { obtained_at?: number })>();

  const merged: CognitoTokenResponse & { obtained_at: number } = {
    ...(old ?? {}),
    ...(token ?? {}),
    refresh_token: token?.refresh_token ?? old?.refresh_token,
    obtained_at: Date.now(),
  };

  sessionStorage.setItem(K_TOKEN, JSON.stringify(merged));
  sessionStorage.removeItem(K_USERINFO);
}

// 读取 token
export function readOAuthToken<T = any>(): T | null {
  const raw = sessionStorage.getItem(K_TOKEN);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// 保存 userInfo（缓存）
export function saveOAuthUserInfo(info: CognitoUserInfo) {
  sessionStorage.setItem(K_USERINFO, JSON.stringify(info));
}

// 读取 userInfo（缓存）
export function readOAuthUserInfo<T = CognitoUserInfo>(): T | null {
  const raw = sessionStorage.getItem(K_USERINFO);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// 清除所有（登出）
export function clearOAuthToken() {
  sessionStorage.removeItem(K_TOKEN);
  sessionStorage.removeItem(K_USERINFO);
}
