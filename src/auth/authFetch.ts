// src/auth/authFetch.ts
// 作用：
// 1) 自动从 sessionStorage 读取 access_token
// 2) 自动附带 Authorization: Bearer <token>
// 3) 当传入的是相对路径时，自动拼接 API_BASE
// 4) 请求前：若 token 快过期（expires_in + obtained_at），先 refresh 再请求
// 5) 兜底：如果仍返回 401，再 refresh 一次并重试一次（只重试一次）

import { API_BASE } from "./apiConfig";
import { clearOAuthToken, readOAuthToken, saveOAuthToken } from "./storage";
import { refreshToken, type CognitoTokenResponse } from "./token";

type AuthFetchInit = RequestInit & {
  // 是否允许匿名请求（默认 false）
  allowAnonymous?: boolean;
};

type StoredToken = CognitoTokenResponse & {
  obtained_at?: number; // storage.ts 保存的时间戳（ms）
};

function toHeaders(input?: HeadersInit): Headers {
  if (!input) return new Headers();
  return input instanceof Headers ? new Headers(input) : new Headers(input);
}

function buildUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

async function doFetch(
  url: string,
  init: RequestInit,
  accessToken?: string
): Promise<Response> {
  const finalHeaders = toHeaders(init.headers);

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

// 判断 token 是否“快过期”
// bufferSeconds：提前多少秒刷新（默认 60 秒）
function isTokenExpiringSoon(token: StoredToken | null, bufferSeconds = 60): boolean {
  if (!token?.access_token) return true;

  const obtainedAt = token.obtained_at ?? 0;
  const expiresIn = token.expires_in ?? 0;

  // 没有 obtained_at 或 expires_in 就无法可靠判断，交给 401 兜底
  if (!obtainedAt || !expiresIn) return false;

  const expireAtMs = obtainedAt + expiresIn * 1000;
  const nowMs = Date.now();

  return nowMs >= (expireAtMs - bufferSeconds * 1000);
}

async function tryRefreshOnce(token: StoredToken | null): Promise<StoredToken | null> {
  const rt = token?.refresh_token;
  if (!rt) return null;

  const newToken = await refreshToken(rt);
  // storage.ts 会 merge 保留旧 refresh_token，并写 obtained_at
  saveOAuthToken(newToken);
  return readOAuthToken<StoredToken>();
}

export async function authFetch(
  path: string,
  init: AuthFetchInit = {}
): Promise<Response> {
  const { allowAnonymous = false, ...rest } = init;

  // 读取 token
  let token = readOAuthToken<StoredToken>();
  let accessToken = token?.access_token;

  if (!accessToken && !allowAnonymous) {
    throw new Error("未登录或 access_token 不存在");
  }

  // 请求前：快过期就先 refresh（不等 401）
  if (!allowAnonymous && isTokenExpiringSoon(token, 60)) {
    try {
      const refreshed = await tryRefreshOnce(token);
      if (refreshed?.access_token) {
        token = refreshed;
        accessToken = refreshed.access_token;
      }
    } catch {
      // 预刷新失败：清掉本地 token，让上层决定要不要重新登录
      clearOAuthToken();
      throw new Error("token 刷新失败：请重新登录");
    }
  }

  const url = buildUrl(path);

  // 第一次请求
  const resp1 = await doFetch(url, rest, accessToken);

  // 如果不是 401，直接返回
  if (resp1.status !== 401) return resp1;

  // 401 兜底：再尝试 refresh 一次 + 重试一次
  if (allowAnonymous) return resp1;

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
