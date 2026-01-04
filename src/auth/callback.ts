// src/auth/callback.ts
// 作用：处理 OAuth 回调
// 流程：
// 1) 从 URL 读取 code / state
// 2) 读取并清除本地 verifier / state
// 3) 校验 state
// 4) 用 code + verifier 换 token
// 5) 保存 token

import { consumeOAuthTemp, saveOAuthToken } from "./storage";
import { exchangeToken, type CognitoTokenResponse } from "./token";

export async function handleOAuthCallback(
  query: Record<string, any>
): Promise<CognitoTokenResponse> {
  const code = String(query.code || "");
  const returnedState = String(query.state || "");

  if (!code) throw new Error("URL 中缺少 code，请重新登录");
  if (!returnedState) throw new Error("URL 中缺少 state，请重新登录");

  const { verifier, state: expectedState } = consumeOAuthTemp();

  if (!verifier || !expectedState) {
    throw new Error("本地登录状态已丢失，请重新登录");
  }

  if (returnedState !== expectedState) {
    throw new Error("state 不匹配，可能是非法请求");
  }

  const token = await exchangeToken(code, verifier);

  saveOAuthToken(token);
  return token;
}
