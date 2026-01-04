// src/auth/index.ts
// 作用：auth 模块统一出口（barrel file）

export { login } from "./oauth";

export {
    clearOAuthToken,
    consumeOAuthTemp,
    readOAuthToken,
    saveOAuthTemp,
    saveOAuthToken
} from "./storage";

// NodeNext/Node16 下要写 .js（TS 会自动映射到 .ts 源文件）
export { authFetch } from "./authFetch.js";
export { handleOAuthCallback } from "./callback.js";
export type { CognitoTokenResponse } from "./token.js";

