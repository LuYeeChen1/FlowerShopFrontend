# User Model & Display Strategy

## 数据来源优先级

1. Cognito `/oauth2/userInfo`（登录后拉取并缓存）
2. JWT payload（UI 兜底）

---

## 展示策略

- 先尝试 `email` / `name`
- 再尝试 `preferred_username` / `username`
- 最后兜底 `sub`（只取前几位）

---

## 设计目标

- userInfo 失败不影响 UI
- 至少能显示一个“当前用户”
- 解码 JWT 仅用于显示，不做权限或安全判断
