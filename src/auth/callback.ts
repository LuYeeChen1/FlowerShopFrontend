// src/auth/callback.ts
// Step 4：OAuth 回调处理（新手版）
//
// 这个文件是干嘛的？
// 👉 登录成功后，专门“接住 Cognito 跳回来的页面”
//
// 整个登录流程，到这里才算真正完成。
//
// 这里做的事（按顺序）：
// 1) 检查有没有拿到 code
// 2) 取回之前存的 verifier 和 state
// 3) 校验 state，防止被别人冒充
// 4) 用 code + verifier 换 token
// 5) 保存 token
// 6) 顺便拉一次用户信息
//
// 页面（Callback.vue）
// 👉 只负责调用这个函数，不写任何业务逻辑

import {
  consumeOAuthTemp,
  saveOAuthToken,
  saveOAuthUserInfo,
} from "./storage";
import { exchangeToken } from "./token";
import { fetchUserInfo } from "./userInfo";

// 处理 OAuth 回调
// query 来自 URL，例如 ?code=xxx&state=yyy
export async function handleOAuthCallback(query: {
  code?: string;
  state?: string;
}) {
  // 从 URL 里取 code 和 state
  const code = query.code;
  const returnedState = query.state;

  // 如果没有 code，说明不是正常登录返回
  if (!code) {
    throw new Error("OAuth callback 缺少 code");
  }

  // 1️⃣ 取出并删除之前存的 verifier 和 state
  // 这些数据只能用一次
  const { verifier, state: expectedState } = consumeOAuthTemp();

  // 如果拿不到，通常是重复进了 callback
  if (!verifier || !expectedState) {
    throw new Error("OAuth 临时状态不存在（可能重复进入 callback）");
  }

  // 校验 state，防止 CSRF 攻击
  if (returnedState !== expectedState) {
    throw new Error("OAuth state 校验失败（CSRF 防护）");
  }

  // 2️⃣ 用 code + verifier 去换 token
  const token = await exchangeToken(code, verifier);

  // 3️⃣ 保存 token（包含获取时间）
  saveOAuthToken(token);

  // 4️⃣ 用 access_token 拉用户信息（不是强制）
  const accessToken = token.access_token;
  if (accessToken) {
    try {
      const info = await fetchUserInfo(accessToken);
      saveOAuthUserInfo(info);
    } catch {
      // 拉不到 userInfo 也不影响登录
      // 后面还能用 token 里的信息
    }
  }
}
