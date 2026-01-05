// src/auth/userInfo.ts
// 作用：用 access_token 调 Cognito 的 OIDC userInfo endpoint 获取用户资料
// Endpoint: {COGNITO_DOMAIN}/oauth2/userInfo
// Header: Authorization: Bearer <access_token>

import { COGNITO_DOMAIN } from "./config";

export type CognitoUserInfo = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  username?: string;
  [k: string]: any;
};

export async function fetchUserInfo(
  accessToken: string
): Promise<CognitoUserInfo> {
  if (!accessToken) {
    throw new Error("access_token 不存在：无法获取 userInfo");
  }

  const resp = await fetch(`${COGNITO_DOMAIN}/oauth2/userInfo`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
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
      `${data?.error || "userInfo_error"}: ${data?.error_description || text}`
    );
  }

  return data as CognitoUserInfo;
}
