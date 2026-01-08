# User Model & Display Strategy

## 数据来源优先级

1. Cognito /oauth2/userInfo
2. JWT payload（兜底）

---

## 设计目标

- userInfo 失败不影响 UI
- 至少能显示一个“当前用户”
