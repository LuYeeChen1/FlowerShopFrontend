# authFetch Design

## 目标

- 自动加 Authorization header
- 过期前 refresh
- 401 自动恢复一次

---

## 行为约定

- 所有登录态 API 必须用 `authFetch()`
- 页面不直接处理 token
- refresh 逻辑集中在 `auth/request` 中

---

## 关键行为细节

- 相对路径会拼接 `API_BASE`（`auth/config/api.ts`）
- 默认要求登录；可通过 `allowAnonymous` 放行匿名请求
- token 即将过期（默认 60 秒缓冲）会提前刷新
- 401 时会尝试刷新并重试一次
- 刷新失败会清理 token 并抛出错误
