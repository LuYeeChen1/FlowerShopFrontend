// src/auth/callback.ts
// 作用：
// OAuth 回调的唯一入口（业务全集中在这里）
//
// 完整流程：
// 1) 校验 code / state
// 2) 用 code + PKCE verifier 换 token
// 3) 保存 token（含 refresh_token / obtained_at）
// 4) 用 access_token 拉 Cognito /oauth2/userInfo
// 5) 缓存 userInfo
//
// Callback.vue 只需要调用 handleOAuthCallback() 即可

import {
  consumeOAuthTemp,
  saveOAuthToken,
  saveOAuthUserInfo,
} from "./storage";
import { exchangeToken } from "./token";
import { fetchUserInfo } from "./userInfo";

export async function handleOAuthCallback(query: {
  code?: string;
  state?: string;
}) {
  const code = query.code;
  const returnedState = query.state;

  if (!code) {
    throw new Error("OAuth callback 缺少 code");
  }

  // 1) 取出并消费 PKCE verifier + state
  const { verifier, state: expectedState } = consumeOAuthTemp();

  if (!verifier || !expectedState) {
    throw new Error("OAuth 临时状态不存在（可能重复进入 callback）");
  }

  if (returnedState !== expectedState) {
    throw new Error("OAuth state 校验失败（CSRF 防护）");
  }

  // 2) 用 code + verifier 换 token
  const token = await exchangeToken(code, verifier);

  // 3) 保存 token（storage.ts 会处理 merge / obtained_at）
  saveOAuthToken(token);

  // 4) 立刻拉 userInfo（不作为硬失败条件）
  const accessToken = token.access_token;
  if (accessToken) {
    try {
      const info = await fetchUserInfo(accessToken);
      saveOAuthUserInfo(info);
    } catch {
      // userInfo 拉失败不影响登录
      // AppLayout 还有 JWT fallback
    }
  }
}
