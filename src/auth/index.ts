// src/auth/index.ts
// Step 8：auth 模块统一出口（新手版）
//
// 这个文件是干嘛的？
// 👉 把 auth 目录里的功能“集中打包再导出”
//
// 为什么要有它？
// - 页面不用记一堆文件路径
// - 只需要 import "@/auth"
//
// 这个文件不做什么？
// - 不写逻辑
// - 不处理登录
// - 不访问网络

// 登录入口
export { login } from "./oauth";

// 存储相关（token / 临时数据 / userInfo）
export {
    clearOAuthToken,
    consumeOAuthTemp,
    readOAuthToken,
    readOAuthUserInfo,
    saveOAuthTemp,
    saveOAuthToken,
    saveOAuthUserInfo
} from "./storage";

// OAuth 回调处理
export { handleOAuthCallback } from "./callback";

// token 交换与刷新
export { exchangeToken, refreshToken } from "./token";
export type { CognitoTokenResponse } from "./token";

// 用户资料
export { fetchUserInfo } from "./userInfo";
export type { CognitoUserInfo } from "./userInfo";

// 带登录状态的 fetch
export { authFetch } from "./authFetch";
