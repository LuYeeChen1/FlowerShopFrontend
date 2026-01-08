// src/auth/request/tokenTypes.ts
// Cognito 返回的 token 数据结构
// 这里只列出我们常用的字段
export type CognitoTokenResponse = {
  access_token: string;   // 调用 API 用
  id_token?: string;      // 身份信息（可选）
  refresh_token?: string; // 用来刷新 token（可选）
  token_type: string;     // 通常是 Bearer
  expires_in: number;     // access_token 有效秒数
  scope?: string;         // 返回的 scope
  [k: string]: any;       // 其他字段
};
