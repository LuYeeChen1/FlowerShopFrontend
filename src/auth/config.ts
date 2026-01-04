// src/auth/config.ts
// 作用：集中管理 OAuth / Cognito 的静态配置
// 所有值来自 Vite 环境变量（避免写死）

// Cognito Hosted UI 域名
export const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN as string;

// Cognito App Client ID（Public Client）
export const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID as string;

// OAuth 回调地址（必须与 Cognito 配置完全一致）
export const REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI as string;

// OAuth scopes（保持最小即可）
export const SCOPES = ["openid", "email", "profile"] as const;
