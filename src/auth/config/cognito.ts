// src/auth/config/cognito.ts
// Step 0：Auth 配置文件
//
// 这个文件是干嘛的？
// - 告诉前端「登录/登出要用哪些固定信息」
//
// 这个文件不干嘛？
// - 不处理登录
// - 不请求 API
// - 不存 token
//
// 如果登录/登出出问题，先看这里。

// Cognito Hosted UI 域名（不要带 /login 或 /logout 路径）
// 例如：https://xxx.auth.us-east-1.amazoncognito.com
export const COGNITO_DOMAIN =
  import.meta.env.VITE_COGNITO_DOMAIN as string;

// Cognito App Client ID（Public Client）
export const CLIENT_ID =
  import.meta.env.VITE_COGNITO_CLIENT_ID as string;

// 登录成功后回到的前端地址（OAuth callback）
// 必须与 Cognito 控制台 Allowed callback URLs 完全一致
export const REDIRECT_URI =
  import.meta.env.VITE_COGNITO_REDIRECT_URI as string;

// 登出成功后回到的前端地址（logout redirect）
// 必须与 Cognito 控制台 Allowed sign-out URLs 完全一致
export const LOGOUT_REDIRECT_URI =
  import.meta.env.VITE_COGNITO_LOGOUT_REDIRECT_URI as string;

// OAuth scopes：允许返回的基本用户信息
export const SCOPES = ["openid", "email", "profile"] as const;

// --- 可选但强烈建议：启动时做一次校验，少踩坑 ---
function required(name: string, value: string | undefined): string {
  if (!value || !value.trim()) {
    throw new Error(`[auth/config] Missing env: ${name}`);
  }
  return value;
}

required("VITE_COGNITO_DOMAIN", COGNITO_DOMAIN);
required("VITE_COGNITO_CLIENT_ID", CLIENT_ID);
required("VITE_COGNITO_REDIRECT_URI", REDIRECT_URI);
required("VITE_COGNITO_LOGOUT_REDIRECT_URI", LOGOUT_REDIRECT_URI);
