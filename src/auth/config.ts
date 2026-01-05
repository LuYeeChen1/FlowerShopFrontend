// src/auth/config.ts
// Step 0：Auth 配置文件
//
// 这个文件是干嘛的？
// - 告诉前端「登录要用哪些固定信息」
//
// 这个文件不干嘛？
// - 不处理登录
// - 不请求 API
// - 不存 token
//
// 如果登录出问题，先看这里。

// Cognito 登录页面的地址
// 用户点击“登录”后，浏览器会跳到这里
export const COGNITO_DOMAIN =
  import.meta.env.VITE_COGNITO_DOMAIN as string;

// 前端应用的身份 ID
// 用来告诉 Cognito：是谁在请求登录
export const CLIENT_ID =
  import.meta.env.VITE_COGNITO_CLIENT_ID as string;

// 登录成功后要回到的前端地址
// 必须和 Cognito 控制台里的配置完全一样
export const REDIRECT_URI =
  import.meta.env.VITE_COGNITO_REDIRECT_URI as string;

// 登录后允许返回的基本用户信息
// 一般只用这三个
export const SCOPES = ["openid", "email", "profile"] as const;
