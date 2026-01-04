// src/auth/token.ts
// 作用：用 authorization_code + PKCE 向 Cognito 换 token

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
