// src/auth/login/pkce.ts
// Step 1：PKCE 工具函数
//
// 为什么要有这个文件？
// - 前端没有密码（public client）
// - PKCE 用来防止登录结果被别人偷走
//
// 这个文件做什么？
// - 把 verifier（原始字符串）
// - 变成 challenge（登录用字符串）
//
// 不做什么？
// - 不登录
// - 不存数据
// - 不跳页面

// 把二进制数据转成 URL 能用的字符串
// 因为 challenge 会放进登录地址
function base64url(bytes: ArrayBuffer): string {
  // 把二进制转成普通字符串
  const bin = String.fromCharCode(...new Uint8Array(bytes));

  // 转成 base64
  // 并换成 URL 安全的字符
  return btoa(bin)
    .replace(/\+/g, "-") // + 在 URL 里不安全
    .replace(/\//g, "_") // / 在 URL 里不安全
    .replace(/=+$/, ""); // 去掉多余的 =
}

// 根据 verifier 生成 challenge
export async function pkceChallenge(verifier: string): Promise<string> {
  // 把字符串转成可以加密的数据
  const data = new TextEncoder().encode(verifier);

  // 用浏览器自带的 SHA-256 加密
  const digest = await crypto.subtle.digest("SHA-256", data);

  // 转成登录时需要的格式
  return base64url(digest);
}
