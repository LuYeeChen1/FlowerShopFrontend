# Authentication Flow (Cognito OAuth2 + PKCE)

## 登录流程

1. 用户访问 `/`（`pages/Auth.vue`）
2. 点击登录按钮，触发 `login()`（`auth/login/oauth.ts`）
3. 生成 PKCE verifier / challenge（`auth/login/pkce.ts`）
4. 生成 state 并存入 sessionStorage（`auth/storage/tempStorage.ts`）
5. 拼接 Cognito Hosted UI 授权 URL 并跳转

---

## 回调流程

1. Cognito redirect `/callback?code&state`
2. `handleOAuthCallback()` 校验 state（`auth/callback/handleCallback.ts`）
3. code + verifier 换 token（`auth/callback/tokenExchange.ts`）
4. 保存 access/refresh token（`auth/storage/tokenStorage.ts`）
5. （可选）拉取 userInfo 并缓存（`auth/userInfo.ts`）
6. 清理 URL query，并跳转 `/app/me`

---

## 登出流程

1. Header 点击 Logout（`layouts/app/useAppLayout.ts`）
2. 清理本地 token / userInfo（`auth/storage/tokenStorage.ts`）
3. 跳转 Cognito logout endpoint
4. Cognito redirect `/signed-out`
