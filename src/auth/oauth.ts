// src/auth/oauth.ts
// 作用：OAuth 登录入口
// 职责：
// 1) 生成 PKCE verifier
// 2) 生成 OAuth state
// 3) 保存到 sessionStorage
// 4) 跳转到 Cognito Hosted UI

import { CLIENT_ID, COGNITO_DOMAIN, REDIRECT_URI, SCOPES } from "./config";
import { pkceChallenge } from "./pkce";
import { saveOAuthTemp } from "./storage";

// 生成安全随机字符串（基于浏览器 CSPRNG）
function gen(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

// 对外暴露的登录函数
export async function login(): Promise<void> {
  // PKCE verifier（加长，防猜测）
  const verifier = gen() + gen();

  // OAuth state（防 CSRF）
  const state = gen();

  // 保存临时数据
  saveOAuthTemp({ verifier, state });

  // 构造 /authorize 请求参数
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(" "),
    code_challenge_method: "S256",
    code_challenge: await pkceChallenge(verifier),
    state,
  });

  // 跳转到 Cognito Hosted UI
  window.location.assign(
    `${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`
  );
}
