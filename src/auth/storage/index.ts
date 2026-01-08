// src/auth/storage/index.ts
// 统一导出 storage 相关方法

export { saveOAuthTemp, consumeOAuthTemp } from "./tempStorage";
export { saveOAuthToken, readOAuthToken, clearOAuthToken } from "./tokenStorage";
export { saveOAuthUserInfo, readOAuthUserInfo } from "./userInfoStorage";
