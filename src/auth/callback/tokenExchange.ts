// src/auth/callback/tokenExchange.ts
// Step 5：Token 交换（新手版）
//
// 这个文件是干嘛的？
// 👉 第一次登录：用 code + verifier 换 token

import { CLIENT_ID, COGNITO_DOMAIN, REDIRECT_URI } from "../config/cognito";
import type { CognitoTokenResponse } from "../request/tokenTypes";

// ------------------------------------
// 第一次登录：用 code + verifier 换 token
// ------------------------------------
export async function exchangeToken(
  code: string,
  verifier: string
): Promise<CognitoTokenResponse> {
  // 准备 POST 表单参数
  const body = new URLSearchParams({
    grant_type: "authorization_code", // 授权码模式
    client_id: CLIENT_ID,              // 前端应用是谁
    redirect_uri: REDIRECT_URI,         // 必须和登录时一致
    code,                               // 登录后拿到的 code
    code_verifier: verifier,            // PKCE 原始字符串
  });

  // 向 Cognito 发送请求
  const resp = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  // 先当文本读出来，方便报错
  const text = await resp.text();

  // 尝试解析成 JSON
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  // 如果 HTTP 状态不是 2xx，直接报错
  if (!resp.ok) {
    throw new Error(
      `${data?.error || "token_error"}: ${data?.error_description || text}`
    );
  }

  // 返回 token 数据
  return data as CognitoTokenResponse;
}
