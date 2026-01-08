// src/auth/storage/tempStorage.ts
// Step 2：Auth 存储工具（新手版）
//
// 这个文件是干嘛的？
// 👉 统一“存”和“拿”登录相关的临时数据
//
// 用什么存？
// 👉 sessionStorage
// - 只在当前浏览器 tab 有效
// - 关掉 tab 数据就没了

// -------------------------------
// 定义 storage 里用到的 key
// -------------------------------
const K_VERIFIER = "pkce_verifier";   // PKCE 原始字符串
const K_STATE = "oauth_state";        // OAuth 防攻击用的 state

// -------------------------------
// 登录前：保存临时数据
// -------------------------------
// 保存 PKCE verifier 和 state
// 登录开始前调用
export function saveOAuthTemp(input: { verifier: string; state: string }) {
  sessionStorage.setItem(K_VERIFIER, input.verifier);
  sessionStorage.setItem(K_STATE, input.state);
}

// -------------------------------
// 登录回调时：读取并立刻清掉
// -------------------------------
// 这些数据只用一次，用完就删
export function consumeOAuthTemp(): { verifier: string; state: string } {
  const verifier = sessionStorage.getItem(K_VERIFIER) || "";
  const state = sessionStorage.getItem(K_STATE) || "";

  sessionStorage.removeItem(K_VERIFIER);
  sessionStorage.removeItem(K_STATE);

  return { verifier, state };
}
