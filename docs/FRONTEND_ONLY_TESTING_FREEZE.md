# FRONTEND_ONLY_TESTING_FREEZE.md

## Frontend-Only Testing 原则（冻结）

> 本文件定义 **Seller Onboarding 阶段的测试与验证方式**。  
> 一经确认，视为冻结事实，不再更改。

---

## 一、核心原则（一句话）

**从即日起，Seller Onboarding 相关功能：**  
❌ 不再使用 Postman / Lambda Console / 手动 HTTP 调用测试  
✅ **只允许通过 Frontend（真实用户路径）进行验证**

---

## 二、适用范围

本原则适用于以下所有能力与组件：

### 涉及的 Lambda
- `flowershop-seller-docs-presign`
- `flowershop-seller-docs-confirm`
- `flowershop-seller-onboarding-draft`
- `flowershop-seller-onboarding-submit`

### 涉及的云组件
- API Gateway（HTTP API + JWT Authorizer）
- Cognito User Pool / JWT / UserInfo
- DynamoDB（FlowerShop 表）
- S3 Presigned Upload

---

## 三、明确禁止的测试方式（冻结）

以下方式 **从现在开始一律禁止** 用于功能验证：

- ❌ 使用 Postman 手动调用 API
- ❌ 使用 Lambda Console 的 Test Event
- ❌ 手动复制 / 粘贴 / 伪造 JWT Token
- ❌ 绕过 Frontend 的直连测试
- ❌ 为测试目的新增任何「临时接口 / 临时代码」

> 说明：  
> 以上方式无法反映真实用户路径，  
> 且可能掩盖 Cognito / JWT Authorizer / CORS / Token 生命周期等问题。

---

## 四、唯一允许的验证方式（冻结）

### ✅ Frontend 真实调用链路

所有验证 **必须** 经过以下完整路径：

