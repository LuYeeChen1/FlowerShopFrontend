# Security Model

## PKCE

- 使用 S256
- verifier 只存在 sessionStorage
- 每次登录唯一

---

## state（防 CSRF）

- 登录前生成
- 回调时严格校验
- 不一致直接拒绝换 token

---

## Token 存储策略

- 使用 sessionStorage
- 浏览器关闭即失效
- 避免 localStorage 长驻风险

---

## 授权边界

- 前端：携带 token
- 后端：验证 token + 决策权限
- UI 不等于权限
