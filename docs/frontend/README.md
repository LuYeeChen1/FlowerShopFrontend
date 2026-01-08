# FlowerShop Frontend Documentation

本目录包含 FlowerShop 前端项目的**完整实现说明文档**，用于：

- 项目交付 / 展示
- 新成员快速理解
- 新 Session 0 失忆恢复
- 架构与安全 Review

---

## 文档结构一览

1. `OVERVIEW.md`  
   → 项目总体实现了什么（一句话到一页级别）

2. `ARCHITECTURE.md`  
   → 前端整体架构与模块边界

3. `AUTH_FLOW.md`  
   → Cognito OAuth2 + PKCE 登录 / 回调 / 登出全流程

4. `SECURITY_MODEL.md`  
   → 安全设计、PKCE、state、token 存储与边界

5. `ROUTING_MODEL.md`  
   → 路由分区、受保护区域、页面职责

6. `AUTH_FETCH.md`  
   → 登录态 API 请求与 token 自动刷新机制

7. `USER_MODEL.md`  
   → 用户信息来源、展示策略、JWT 兜底

8. `LAYOUT_AND_NAV.md`  
   → 登录后布局、导航、Logout 设计

9. `FILE_MAPPING.md`  
   → 功能 → 文件的完整映射表

10. `VERIFICATION_CHECKLIST.md`  
    → 可验证清单（老师 / Review / Demo）

---

> 说明：  
> 本前端以 **Amazon Cognito Hosted UI** 为认证基座，  
> 前端只负责 token 生命周期管理与 API 调用，不承担最终授权判断。
