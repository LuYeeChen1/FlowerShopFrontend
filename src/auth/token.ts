// src/auth/token.ts
// Step 5：Token 交换与刷新（新手版）
//
// 这个文件是干嘛的？
// 👉 专门和 Cognito 的 /oauth2/token 接口打交道
//
// 它只做两件事：
// 1️⃣ 第一次登录：用 code + verifier 换 token
// 2️⃣ 之后过期：用 refresh_token 刷新 token
//
// 不做的事：
// - 不存 token
// - 不判断登录状态
// - 不管页面跳转

import { CLIENT_ID, COGNITO_DOMAIN, REDIRECT_URI } from "./config";

// Cognito 返回的 token 数据结构
// 这里只列出我们常用的字段
export type CognitoTokenResponse = {
  access_token: string;   // 调用 API 用
  id_token?: string;      // 身份信息（可选）
  refresh_token?: string; // 用来刷新 token（可选）
  token_type: string;     // 通常是 Bearer
  expires_in: number;     // access_token 有效秒数
  scope?: string;         // 返回的 scope
  [k: string]: any;       // 其他字段
};

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
