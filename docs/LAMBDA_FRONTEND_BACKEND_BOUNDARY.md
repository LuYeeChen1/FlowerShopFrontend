# Lambda / Frontend / Backend 边界说明（冻结版）

> 本文件用于**明确 Seller Onboarding 相关 Lambda 究竟连接 Frontend 还是 Backend（Spring Boot）**。  
> 一经确认，视为**冻结事实**，后续不得混用或反向接入。

==================================================
一、最高优先级结论（一句话）
==================================================

- ✅ 当前所有 Seller Onboarding 相关 Lambda **只连接 Frontend（经 API Gateway）**
- ❌ **不连接 Spring Boot Backend**

这些 Lambda 的统一定位：

- Cloud Infra Writer / Uploader
- 负责「云端写入 / 上传 / 身份锚定」
- **不属于业务后端**

--------------------------------------------------

==================================================
二、已存在 Lambda 与调用归属（冻结清单）
==================================================

| Lambda 名称 | 调用方 | 作用 | 是否经过 Spring Boot |
|------------|--------|------|----------------------|
| flowershop-seller-docs-presign | Frontend | 生成 S3 Presigned PUT URL | ❌ 否 |
| flowershop-seller-docs-confirm | Frontend | 写入 Seller Document 记录 | ❌ 否 |
| flowershop-seller-onboarding-draft | Frontend | 创建 / 更新 Onboarding 草稿 | ❌ 否 |
| flowershop-seller-onboarding-submit | Frontend | 提交 Onboarding（DRAFT → SUBMITTED） | ❌ 否 |

**结论：目前 4 个 Lambda，100% 属于 Frontend → Cloud 通道。**

--------------------------------------------------

==================================================
三、这些 Lambda 允许做什么（冻结）
==================================================

Lambda **只允许**做以下事情：

- 从 JWT claims 读取 `sub`
- 必要时调用 Cognito UserInfo 获取账号资料（如 `accountEmail`）
- 将只读账号资料写入 DynamoDB（只作为副本）
- 写入 Seller Onboarding / Document 等**基础数据**
- 生成 S3 Presigned URL

--------------------------------------------------

==================================================
四、这些 Lambda 明确禁止做什么（冻结）
==================================================

以下行为 **明确禁止** 出现在这些 Lambda 中：

- ❌ 业务校验（validate）
- ❌ 复杂规则判断
- ❌ 状态机推进（除最小 DRAFT → SUBMITTED）
- ❌ Cognito Group 切换
- ❌ Admin / Seller 审核逻辑
- ❌ 与商城业务（Product / Order / Payment）耦合

--------------------------------------------------

==================================================
五、Spring Boot Backend 的职责边界（对照）
==================================================

Spring Boot Backend **将来负责**：

- Seller Onboarding 的业务校验
- 状态机控制（SUBMITTED → PENDING → ACTIVE / REJECTED）
- Admin 审核 API
- Seller / Product / Order / Payment 等业务
- 复杂查询与业务一致性保证

**Spring Boot 不负责：**

- S3 Presigned URL
- 基础 DynamoDB 写入
- Cognito UserInfo 拉取

--------------------------------------------------

==================================================
六、统一判断标准（以后不再混）
==================================================

判断一个接口/功能该不该走 Lambda：

- 如果它只是：
  - 写 DynamoDB
  - 生成 Presigned URL
  - 只依赖 JWT 身份  
  → **Frontend 直连 Lambda**

- 如果它涉及：
  - 业务校验
  - 状态机
  - 管理员 / 卖家权限  
  → **Frontend → Spring Boot Backend**

--------------------------------------------------

==================================================
七、最终冻结声明
==================================================

- 本文件内容已确认
- 属于 Seller Onboarding 的**架构边界冻结事实**
- 后续不得：
  - 让这些 Lambda 反向调用 Spring Boot
  - 让 Frontend 绕过 Backend 访问业务接口

**如需调整，必须新增文档，不得修改本文件。**
