# Frontend Architecture

## 架构原则

- 登录逻辑与业务页面解耦
- token 生命周期集中管理
- 页面不直接操作认证细节
- 所有登录态请求走统一入口

---

## 模块分区

src/
├─ auth/         # 认证与 token 生命周期
│  ├─ login/     # PKCE + Cognito 登录入口
│  ├─ callback/  # OAuth 回调处理与 token 交换
│  ├─ request/   # authFetch + refresh 逻辑
│  ├─ storage/   # sessionStorage 读写封装
│  ├─ display/   # 用户展示名生成逻辑
│  └─ config/    # Cognito / API 基本配置
├─ pages/        # 页面级组件（Auth / Callback / Me / SignedOut）
├─ layouts/      # 登录后布局壳 + 导航
├─ router/       # 路由定义
├─ utils/        # 通用工具（JWT 解析等）

---

## 关键设计点

- `/auth`：只做认证流程和 token 生命周期，不放 UI
- `/pages`：只关心页面展示与路由落地
- `/layouts`：只负责“壳”和导航（Header / Mobile nav）
- `/utils`：仅提供 UI 兜底能力，不做安全校验
