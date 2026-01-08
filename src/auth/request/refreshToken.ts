// src/auth/request/refreshToken.ts
// Step 5：Token 刷新（新手版）
//
// 这个文件是干嘛的？
// 👉 token 过期后：用 refresh_token 刷新 token

import { CLIENT_ID, COGNITO_DOMAIN } from "../config/cognito";
import type { CognitoTokenResponse } from "./tokenTypes";

// ------------------------------------
// token 过期后：用 refresh_token 刷新
// ------------------------------------
export async function refreshToken(
  refresh_token: string
): Promise<CognitoTokenResponse> {
  // 没有 refresh_token 就没法刷新
  if (!refresh_token) {
    throw new Error("refresh_token 不存在：无法刷新 token（请重新登录）");
  }

  // 准备刷新用的参数
  const body = new URLSearchParams({
    grant_type: "refresh_token", // 刷新模式
    client_id: CLIENT_ID,        // 前端应用是谁
    refresh_token,               // 旧的 refresh_token
  });

  // 向 Cognito 请求新 token
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

  // 刷新失败直接报错
  if (!resp.ok) {
    throw new Error(
      `${data?.error || "refresh_error"}: ${data?.error_description || text}`
    );
  }

  // 注意：这里返回的数据可能没有 refresh_token
  return data as CognitoTokenResponse;
}
