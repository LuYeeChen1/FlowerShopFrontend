// src/auth/display/userLabel.ts
// 作用：把 userInfo 或 JWT 解码成展示用用户名

import type { CognitoUserInfo } from "../userInfo";
import type { CognitoTokenResponse } from "../request/tokenTypes";
import { decodeJwtPayload } from "@/utils/jwt";

// storage 里读出来的 token 结构
type StoredToken = CognitoTokenResponse & {
  obtained_at?: number;
};

// -------------------------------
// 从 userInfo 生成展示用名字
// -------------------------------
export function labelFromUserInfo(info: CognitoUserInfo | null): string {
  if (!info) return "";

  if (info.email) return String(info.email);
  if (info.name) return String(info.name);
  if (info.preferred_username) return String(info.preferred_username);
  if (info.username) return String(info.username);
  if (info.sub) return `sub: ${String(info.sub).slice(0, 8)}…`;

  return "";
}

// -------------------------------
// 从 JWT 解码生成展示名（兜底）
// -------------------------------
export function labelFromJwt(token: StoredToken | null): string {
  const jwt = token?.id_token || token?.access_token;
  if (!jwt) return "";

  const payload: any = decodeJwtPayload(jwt);
  if (!payload) return "";

  if (payload.email) return String(payload.email);
  if (payload.name) return String(payload.name);
  if (payload.preferred_username) return String(payload.preferred_username);
  if (payload["cognito:username"]) return String(payload["cognito:username"]);
  if (payload.username) return String(payload.username);
  if (payload.sub) return `sub: ${String(payload.sub).slice(0, 8)}…`;

  return "";
}
