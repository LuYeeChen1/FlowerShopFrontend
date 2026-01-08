# Authentication Flow (Cognito OAuth2 + PKCE)

## 登录流程

1. 用户访问 `/`
2. 点击 Login
3. 生成 PKCE verifier / challenge
4. 生成 state 并存入 sessionStorage
5. 跳转 Cognito Hosted UI

---

## 回调流程

1. Cognito redirect `/callback?code&state`
2. 校验 state
3. code → token
4. 保存 access / refresh token
5. （可选）拉取 userInfo
6. 跳转 `/app/me`

---

## 登出流程

1. 用户点击 Logout
2. 清理 sessionStorage
3. 跳转 Cognito logout endpoint
4. Cognito redirect `/signed-out`
