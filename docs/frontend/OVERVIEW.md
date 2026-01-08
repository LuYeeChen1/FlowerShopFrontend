# Frontend Overview

## 一句话总结

这是一个基于 **Vue 3 + Vite + Tailwind CSS** 的单页应用（SPA），  
通过 **Amazon Cognito OAuth2 Authorization Code + PKCE** 完成登录认证，  
并在登录后提供受保护的应用区域与统一的登录态 API 调用能力。

---

## 核心能力（Key Points）

- OAuth2 + PKCE（S256）
- Cognito Hosted UI（不自建登录）
- sessionStorage 管理 token
- Vue Router 明确区分登录前 / 登录后
- `authFetch()` 统一处理 token、刷新与 401
- Tailwind CSS 提供一致 UI

---

## 前端职责边界

前端负责：

- 登录 / 登出
- token 获取、存储、刷新
- 路由保护与 UI 控制
- API 请求自动携带 token

前端不负责：

- 用户权限最终判断
- 角色晋升 / 管理逻辑
- 数据合法性校验（后端负责）
