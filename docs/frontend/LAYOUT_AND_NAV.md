# App Layout & Navigation

## 布局职责

- `AppLayout.vue` 只保留“壳”与内容区
- Header 与移动端菜单拆到 `layouts/app/*`
- 统一 Logout 行为与用户展示

---

## 导航设计

- `layouts/app/nav.ts` 统一定义导航项
- `useAppLayout()` 负责路由高亮与菜单状态
- 目前仅有 `Me` 导航（`/app/me`）

---

## 用户信息展示

- Header 通过 `useAppLayout()` 获取展示名
- 优先使用 userInfo，否则用 JWT 解析兜底
