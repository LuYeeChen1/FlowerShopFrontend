# Security Model

## PKCE

- 使用 S256
- verifier 仅存于 sessionStorage（临时使用）
- 每次登录唯一生成

---

## state（防 CSRF）

- 登录前生成并写入 sessionStorage
- 回调时严格校验
- 不一致直接拒绝换 token

---

## Token 存储策略

- token / userInfo 全部存 sessionStorage
- 浏览器关闭即失效
- 避免 localStorage 长驻风险

---

## UI 展示兜底

- userInfo 失败时会解码 JWT payload 生成展示名
- JWT 解析仅用于 UI，不做验签或权限判断

---

## 授权边界

- 前端：只负责携带 token
- 后端：验证 token + 决策权限
- UI 不等于权限
