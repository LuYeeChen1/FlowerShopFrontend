# Routing Model

## 路由分区

- `/`：登录页（Auth）
- `/callback`：OAuth 回调
- `/signed-out`：登出落地
- `/me`：兼容旧入口 → 重定向 `/app/me`
- `/app/*`：登录后受保护区域

---

## 设计原则

- `/app/*` 由 AppLayout 统一包裹
- 目前无全局路由守卫，受保护页面通过 `authFetch`/401 处理控制跳转
- 登录态 UI 与认证逻辑解耦
