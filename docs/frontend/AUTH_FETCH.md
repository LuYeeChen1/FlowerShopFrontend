# authFetch Design

## 目标

- 自动加 Authorization header
- 过期前 refresh
- 401 自动恢复一次

---

## 行为约定

- 所有登录态 API 必须用 authFetch
- 页面不直接处理 token
- refresh 逻辑集中在一处
