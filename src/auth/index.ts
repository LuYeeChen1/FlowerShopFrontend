// src/auth/index.ts
// 作用：auth 模块统一出口（barrel file）
// 页面/业务层只 import "@/auth" 即可

export { login } from "./oauth";

export {
    clearOAuthToken, consumeOAuthTemp, readOAuthToken, readOAuthUserInfo, saveOAuthTemp, saveOAuthToken, saveOAuthUserInfo
} from "./storage";

export { handleOAuthCallback } from "./callback";

export { exchangeToken, refreshToken } from "./token";
export type { CognitoTokenResponse } from "./token";

export { fetchUserInfo } from "./userInfo";
export type { CognitoUserInfo } from "./userInfo";

export { authFetch } from "./authFetch";
