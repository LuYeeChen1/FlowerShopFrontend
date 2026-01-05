// src/auth/authFetch.ts
// Step 6：带登录状态的 fetch（新手版）
//
// 这个文件是干嘛的？
// 👉 用来「自动帮你处理 token」再发 API 请求
//
// 你用它的好处：
// - 不用自己读 token
// - 不用自己加 Authorization header
// - token 快过期会自动刷新
// - 遇到 401 会自动再试一次
//
// 页面 / service 只管：
// 👉 authFetch("/me")

import { API_BASE } from "./apiConfig";
import { clearOAuthToken, readOAuthToken, saveOAuthToken } from "./storage";
import { refreshToken, type CognitoTokenResponse } from "./token";

// 扩展 fetch 的参数
type AuthFetchInit = RequestInit & {
  // 是否允许不登录也能请求
  allowAnonymous?: boolean;
};

// storage 里读出来的 token 结构
type StoredToken = CognitoTokenResponse & {
  obtained_at?: number; // token 获取时间
};

// 把 headers 转成 Headers 对象
function toHeaders(input?: HeadersInit): Headers {
  if (!input) return new Headers();
  return input instanceof Headers ? new Headers(input) : new Headers(input);
}

// 把相对路径变成完整 API 地址
function buildUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

// 真正发请求的地方
function doFetch(
  url: string,
  init: RequestInit,
  accessToken?: string
): Promise<Response> {
  const finalHeaders = toHeaders(init.headers);

  // 有 token 就加 Authorization
  if (accessToken) {
    finalHeaders.set("Authorization", `Bearer ${accessToken}`);
  } else {
    finalHeaders.delete("Authorization");
  }

  return fetch(url, {
    ...init,
    headers: finalHeaders,
  });
}

// 判断 token 会不会很快过期
// 提前 60 秒刷新
function isTokenExpiringSoon(
  token: StoredToken | null,
  bufferSeconds = 60
): boolean {
  // 没 token，当作要刷新
  if (!token?.access_token) return true;

  const obtainedAt = token.obtained_at ?? 0;
  const expiresIn = token.expires_in ?? 0;

  // 信息不完整，交给 401 再处理
  if (!obtainedAt || !expiresIn) return false;

  const expireAtMs = obtainedAt + expiresIn * 1000;
  const nowMs = Date.now();

  return nowMs >= expireAtMs - bufferSeconds * 1000;
}

// 尝试刷新一次 token
async function tryRefreshOnce(
  token: StoredToken | null
): Promise<StoredToken | null> {
  const rt = token?.refresh_token;
  if (!rt) return null;

  const newToken = await refreshToken(rt);

  // 保存新 token（storage 会自动合并）
  saveOAuthToken(newToken);

  return readOAuthToken<StoredToken>();
}

// 对外使用的 fetch
export async function authFetch(
  path: string,
  init: AuthFetchInit = {}
): Promise<Response> {
  const { allowAnonymous = false, ...rest } = init;

  // 读取 token
  let token = readOAuthToken<StoredToken>();
  let accessToken = token?.access_token;

  // 需要登录但没有 token
  if (!accessToken && !allowAnonymous) {
    throw new Error("未登录或 access_token 不存在");
  }

  // 请求前：如果 token 快过期，先刷新
  if (!allowAnonymous && isTokenExpiringSoon(token)) {
    try {
      const refreshed = await tryRefreshOnce(token);
      if (refreshed?.access_token) {
        token = refreshed;
        accessToken = refreshed.access_token;
      }
    } catch {
      // 刷新失败，清掉 token
      clearOAuthToken();
      throw new Error("token 刷新失败：请重新登录");
    }
  }

  const url = buildUrl(path);

  // 第一次请求
  const resp1 = await doFetch(url, rest, accessToken);

  // 如果不是 401，直接返回
  if (resp1.status !== 401) return resp1;

  // 如果允许匿名，401 就直接返回
  if (allowAnonymous) return resp1;

  // 401：再刷新一次，再试一次
  try {
    const refreshed = await tryRefreshOnce(token);
    const newAccess = refreshed?.access_token;

    if (!newAccess) {
      clearOAuthToken();
      return resp1;
    }

    return await doFetch(url, rest, newAccess);
  } catch {
    clearOAuthToken();
    return resp1;
  }
}
