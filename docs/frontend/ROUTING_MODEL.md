# Routing Model

## 路由分区

- `/`：登录页
- `/callback`：OAuth 回调
- `/signed-out`：登出落地
- `/app/*`：登录后受保护区域

---

## 设计原则

- `/app/*` 默认认为需要登录
- 未登录不应进入业务页面
- 布局与页面解耦
