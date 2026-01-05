// src/auth/token.ts
// 作用：
// 1) 用 authorization_code + PKCE 向 Cognito 换 token
// 2) 用 refresh_token 向 Cognito 刷新 token

import { CLIENT_ID, COGNITO_DOMAIN, REDIRECT_URI } from "./config";

// Cognito token 返回结构（只关心常用字段）
export type CognitoTokenResponse = {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope?: string;
  [k: string]: any;
};

/**
 * 第一次登录：用 code + PKCE verifier 去换 token
 */
export async function exchangeToken(
  code: string,
  verifier: string
): Promise<CognitoTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code,
    code_verifier: verifier,
  });

  const resp = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const text = await resp.text();

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!resp.ok) {
    throw new Error(
      `${data?.error || "token_error"}: ${data?.error_description || text}`
    );
  }

  return data as CognitoTokenResponse;
}

/**
 * Token 过期后：用 refresh_token 去刷新 access_token / id_token
 *
 * 注意：
 * - Cognito 刷新时“可能不会返回新的 refresh_token”
 * - 所以调用方（下一步我们会在 storage 层合并）要保留旧 refresh_token
 */
export async function refreshToken(
  refresh_token: string
): Promise<CognitoTokenResponse> {
  if (!refresh_token) {
    throw new Error("refresh_token 不存在：无法刷新 token（请重新登录）");
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    refresh_token,
  });

  const resp = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const text = await resp.text();

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!resp.ok) {
    throw new Error(
      `${data?.error || "refresh_error"}: ${data?.error_description || text}`
    );
  }

  return data as CognitoTokenResponse;
}
