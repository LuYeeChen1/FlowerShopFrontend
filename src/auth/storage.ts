// src/auth/storage.ts
// 作用：统一管理 OAuth 临时数据 & token 的存储
// 使用 sessionStorage（tab 级别，刷新会丢，安全）

const K_VERIFIER = "pkce_verifier";
const K_STATE = "oauth_state";
const K_TOKEN = "oauth_token";

// 保存 PKCE verifier + OAuth state（登录前）
export function saveOAuthTemp(input: {
  verifier: string;
  state: string;
}) {
  sessionStorage.setItem(K_VERIFIER, input.verifier);
  sessionStorage.setItem(K_STATE, input.state);
}

// 读取并清除（一次性消费）
export function consumeOAuthTemp(): {
  verifier: string;
  state: string;
} {
  const verifier = sessionStorage.getItem(K_VERIFIER) || "";
  const state = sessionStorage.getItem(K_STATE) || "";

  sessionStorage.removeItem(K_VERIFIER);
  sessionStorage.removeItem(K_STATE);

  return { verifier, state };
}

// 保存 token（给后续 API 调用使用）
export function saveOAuthToken(token: unknown) {
  sessionStorage.setItem(K_TOKEN, JSON.stringify(token));
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

// 清除 token（登出）
export function clearOAuthToken() {
  sessionStorage.removeItem(K_TOKEN);
}
