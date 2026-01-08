# Frontend Overview

## 一句话总结

这是一个基于 **Vue 3 + Vite + Tailwind CSS** 的单页应用（SPA），  
通过 **Amazon Cognito OAuth2 Authorization Code + PKCE** 完成登录认证，  
登录后提供受保护的 `/app/*` 区域，并通过 `authFetch()` 统一完成登录态 API 请求。

---

## 核心能力（Key Points）

- OAuth2 + PKCE（S256）
- Cognito Hosted UI（不自建登录页）
- sessionStorage 管理 OAuth 临时数据 / token / userInfo
- Vue Router 明确区分登录前 / 登录后
- `authFetch()` 统一处理 token、刷新与 401 重试
- Tailwind CSS 提供一致 UI

---

## 前端职责边界

前端负责：

- 登录 / 登出跳转
- token 获取、存储、刷新
- 路由区分与 UI 控制
- API 请求自动携带 token

前端不负责：

- 用户权限最终判断
- 角色/权限管理逻辑
- 数据合法性校验（由后端负责）
