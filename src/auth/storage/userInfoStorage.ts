// src/auth/storage/userInfoStorage.ts
// Step 2：Auth 存储工具（新手版）
//
// 这个文件是干嘛的？
// 👉 统一“存”和“拿”用户信息缓存

import type { CognitoUserInfo } from "../userInfo";

// -------------------------------
// 定义 storage 里用到的 key
// -------------------------------
const K_USERINFO = "oauth_userinfo";  // 用户信息缓存

// -------------------------------
// 保存用户信息（缓存）
// -------------------------------
export function saveOAuthUserInfo(info: CognitoUserInfo) {
  sessionStorage.setItem(K_USERINFO, JSON.stringify(info));
}

// -------------------------------
// 读取用户信息（缓存）
// -------------------------------
export function readOAuthUserInfo<T = CognitoUserInfo>(): T | null {
  const raw = sessionStorage.getItem(K_USERINFO);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
