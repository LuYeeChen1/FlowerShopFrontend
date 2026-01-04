// src/auth/authFetch.ts
// 作用：
// 1) 自动从 sessionStorage 读取 access_token
// 2) 自动附带 Authorization: Bearer <token>
// 3) 当传入的是相对路径时，自动拼接 API_BASE

import { API_BASE } from "./apiConfig";
import { readOAuthToken } from "./storage";

type AuthFetchInit = RequestInit & {
  // 是否允许匿名请求（默认 false）
  allowAnonymous?: boolean;
};

export async function authFetch(
  path: string,
  init: AuthFetchInit = {}
): Promise<Response> {
  const { allowAnonymous = false, headers, ...rest } = init;

  // 读取 token
  const token = readOAuthToken<any>();
  const accessToken = token?.access_token;

  if (!accessToken && !allowAnonymous) {
    throw new Error("未登录或 access_token 不存在");
  }

  // 组装 headers
  const finalHeaders = new Headers(headers || {});
  if (accessToken) {
    finalHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  // 拼接 URL（支持绝对 / 相对）
  const url = path.startsWith("http")
    ? path
    : `${API_BASE}${path}`;

  return fetch(url, {
    ...rest,
    headers: finalHeaders,
  });
}
