// src/auth/login/oauth.ts
// Step 3：OAuth 登录入口
//
// 这个文件是干嘛的？
// 👉 真正“开始登录”的地方
//
// 做了哪几件事？
// 1) 生成随机字符串（给 PKCE 和安全用）
// 2) 把这些临时数据存起来
// 3) 拼好登录用的 URL
// 4) 让浏览器跳转到 Cognito 登录页
//
// 这里不处理回调、不处理 token。

import { CLIENT_ID, COGNITO_DOMAIN, REDIRECT_URI, SCOPES } from "../config/cognito";
import { pkceChallenge } from "./pkce";
import { saveOAuthTemp } from "../storage/tempStorage";

// 生成随机字符串
// 用浏览器自带的安全随机方法
function gen(): string {
  // UUID 去掉 -，变成更紧凑的随机串
  return crypto.randomUUID().replace(/-/g, "");
}

// 对外使用的登录函数
// 页面点“登录”时就会调用它
export async function login(): Promise<void> {
  // 生成 PKCE 的原始字符串
  // 加长是为了更难被猜到
  const verifier = gen() + gen();

  // 生成 state
  // 用来防止别人伪造登录请求
  const state = gen();

  // 把 verifier 和 state 先存起来
  // 回调时还要用
  saveOAuthTemp({ verifier, state });

  // 准备登录用的参数
  const params = new URLSearchParams({
    client_id: CLIENT_ID,              // 前端应用是谁
    response_type: "code",             // 使用授权码流程
    redirect_uri: REDIRECT_URI,         // 登录成功后跳回哪里
    scope: SCOPES.join(" "),            // 需要哪些基本信息
    code_challenge_method: "S256",      // PKCE 加密方式
    code_challenge: await pkceChallenge(verifier), // PKCE challenge
    state,                              // 防攻击用
  });

  // 浏览器跳转到 Cognito 登录页面
  window.location.assign(
    `${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`
  );
}
