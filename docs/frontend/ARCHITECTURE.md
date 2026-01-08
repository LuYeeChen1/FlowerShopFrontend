# Frontend Architecture

## 架构原则

- 登录逻辑与业务页面解耦
- token 生命周期集中管理
- 页面不直接操作认证细节
- 所有登录态请求走统一入口

---

## 模块分区

src/
├─ auth/ # 认证与 token 生命周期
├─ pages/ # 页面级组件
├─ layouts/ # 登录后布局与导航
├─ router/ # 路由定义
├─ utils/ # 通用工具（JWT 解析等）

---

## 关键设计点

- `/auth`：只做认证，不做 UI
- `/pages`：只关心页面逻辑
- `/layouts`：只负责“壳”和导航
- `/utils`：兜底工具，不含业务