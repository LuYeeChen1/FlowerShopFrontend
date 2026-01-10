# CURRENT_PROGRESS.md

**FlowerShop – Seller Onboarding（进度冻结快照｜0 失忆）**

> 本文件用于记录 **已完成事实 / 当前真实进度 / 冻结决策**。  
> 不是计划文档、不是设计讨论文档。  
> **任何未写入本文件的内容，视为尚未开始。**

---

## 一、项目整体状态

* 项目：FlowerShop
* 子系统：Seller Onboarding（平台级）
* 当前目标：  
  👉 在 **0 成本（Free Tier / 本地）** 前提下，完成一个**可真实演示**的 Seller Onboarding 流程
* 架构原则：

    * Clean Architecture
    * 身份与业务状态解耦
    * Cognito 表达权限
    * DynamoDB 表达业务进度
    * **一切实现以“最简单版本”为准**

---

## 二、全局冻结原则（摘要）

以下原则已冻结，不再讨论、不再更改：

1. **身份来源唯一**

    * `sub`、`accountEmail` 只允许来自 **Cognito JWT / UserInfo**
    * Request Body 禁止传入任何身份字段
    * ❌ 不允许用户重新输入账号资料

2. **Cognito ≠ 业务状态**

    * Cognito Group：权限身份
    * DynamoDB：Seller Onboarding 业务进度

3. **Seller Onboarding 与商城业务解耦**

    * Onboarding 不写入商城 MySQL
    * 商品 / 订单 / 支付仍走 MySQL

4. **Cognito 已有资料不重复填写**

    * 登录账号邮箱不要求用户再填
    * `accountEmail` 统一来自 Cognito（JWT claims / UserInfo）
    * ✅ 允许写入 DynamoDB 作为只读副本
    * ❌ 不允许为空
    * ❌ 不兜底
    * ❌ 不要求用户补填
    * `contactEmail` 可默认等于 `accountEmail`，但属于业务字段

5. **最简单原则（最高优先级）**

    * 能删就删
    * 不做增强
    * 不做兜底
    * 不做额外校验
    * 在安全与冻结边界内，始终选择：
        - 最少代码
        - 最少分支
        - 最少复杂度

6. **一次只推进一步**

    * 已完成步骤不回退、不重做
    * 后续功能按最简单版本逐步推进

---

## 三、Cloud / Infra 当前状态（已完成并冻结）

### 1️⃣ DynamoDB

* 表名：`FlowerShop`
* 设计：单表（PK / SK）
* Key 规则（已冻结）：

    * `PK = USER#<sub>`
    * `SK = ONBOARDING#CURRENT`
    * `SK = DOC#<docId>`
    * `SK = REVIEW#<time>#<id>`（尚未使用）

* 表状态：

    * ✅ 已存在
    * ✅ 可写入
    * ✅ 已有真实数据

---

### 2️⃣ S3

* Bucket：`flowershop-seller-docs-dev`
* Block Public Access：全开
* 加密：SSE-S3（非 KMS）
* CORS：已配置（`localhost:5173`）
* 用途：

    * Seller Documents 通过 Presigned URL 直传

---

### 3️⃣ IAM

* Lambda Execution Role：

    * DynamoDB + S3 Full Access
* 决策状态：

    * ✅ 已接受非最小权限风险
    * ✅ 冻结，不再优化

---

### 4️⃣ API Gateway

* 类型：HTTP API
* Cognito JWT Authorizer：✅ 已创建
* 路由状态：

    * documents/presign：已存在
    * documents/confirm：已存在
    * onboarding/draft / submit：**尚未接入 API Gateway（仅 Lambda Console 测试）**

---

## 四、Lambda 当前状态（真实已完成）

### ✅ 已完成并验证通过

#### 1️⃣ `flowershop-seller-docs-presign`

* 功能：
    * 生成 PUT Presigned URL
* 身份来源：
    * `sub` 仅来自 JWT claims
* 特点：
    * 不写 DB
    * 不做校验
* 状态：**冻结**

---

#### 2️⃣ `flowershop-seller-docs-confirm`

* 功能：
    * 写入 Seller Document 记录
* DynamoDB 写入：
    * `PK = USER#<sub>`
    * `SK = DOC#<docId>`
    * `status = UPLOADED`
* 特点：
    * 只写业务记录
    * 不关联 Onboarding 状态
* 状态：**冻结**

---

#### 3️⃣ `flowershop-seller-onboarding-draft`

* 功能：
    * 创建 / 更新 Seller Onboarding 主记录
* DynamoDB 写入：
    * `PK = USER#<sub>`
    * `SK = ONBOARDING#CURRENT`
    * `status = DRAFT`
    * `accountEmail`（来自 Cognito，只读副本）
* 特点：
    * Upsert 行为
    * 不做校验
    * 不推进状态机
* 状态：**冻结**

---

#### 4️⃣ `flowershop-seller-onboarding-submit`

* 功能：
    * 提交 Onboarding
* DynamoDB 更新：
    * `status: DRAFT → SUBMITTED`
    * 写入 `submittedAt`
* 特点：
    * 不校验当前状态
    * 不处理 Cognito Group
* 状态：**冻结**

---

## 五、DynamoDB 当前真实数据状态

### 用户维度（示例）

* `PK = USER#TEST_SUB_123`

#### 已存在记录：

1. `SK = DOC#<docId>`
    * status = UPLOADED

2. `SK = ONBOARDING#CURRENT`
    * status = SUBMITTED
    * accountEmail = <from Cognito>

> 已验证：
> - 同 PK
> - 不同 SK
> - Document / Onboarding 字段互不污染

---

## 六、架构边界状态（已完成并冻结）

### 🔒 Lambda / Frontend / Backend 边界

* Seller Onboarding 相关 Lambda **只连接 Frontend（经 API Gateway）**
* 明确 **不连接 Spring Boot Backend**
* 已写入并冻结文档：`LAMBDA_FRONTEND_BACKEND_BOUNDARY.md`

### Lambda 的统一定位

* 类型：**Cloud Infra Writer / Uploader**
* 角色：
    * 云端写入
    * 上传支撑
    * 身份锚定（Identity Anchor）
* **不属于业务后端**

### Lambda 允许的职责（冻结）

* 从 JWT claims 读取 `sub`
* 必要时调用 Cognito UserInfo 获取账号资料（如 `accountEmail`）
* 将账号资料作为**只读副本**写入 DynamoDB
* 写入 Seller Onboarding / Document 等基础数据
* 生成 S3 Presigned URL

### Lambda 明确禁止的职责（冻结）

* ❌ 业务校验（validate）
* ❌ 复杂规则判断
* ❌ 完整状态机推进（除最小 DRAFT → SUBMITTED）
* ❌ Cognito Group 切换
* ❌ Admin / Seller 审核逻辑
* ❌ 与商城业务（Product / Order / Payment）耦合

---

## 七、当前进度锚点（最重要）

### ✅ 已完成

* Seller Documents：Presign + Confirm 全流程
* Onboarding 主记录创建（DRAFT）
* Onboarding 提交（SUBMITTED）
* accountEmail 与 Cognito 对齐写入
* DynamoDB 单表模型跑通
* Lambda / Frontend / Backend 架构边界冻结

### ⛔ 尚未开始（明确禁止提前）

* Cognito Group 切换（SELLER_PENDING）
* GSI1（PENDING_REVIEW 队列）
* 风险评分
* Admin 审核 API
* Review Log 写入
* Withdraw / Reject / Approve
* API Gateway 正式路由绑定
* Spring Boot 后端接入

---

## 八、下一步边界（仅用于提醒，不自动执行）

**下一步必须满足：**

* 只推进一个可执行产物
* 不回退、不重构已完成 Lambda
* 不提前进入 Admin / Risk / GSI

**可能的下一步候选（未执行）：**

* SUBMITTED → PENDING_REVIEW（含 Cognito Group 切换）
* 接入 API Gateway `/seller/onboarding/*`
* Onboarding 查询接口 `/seller/onboarding/me`

> ⚠️ 以上仅是边界提示，**不会自动推进**。

---

## 九、状态总结

* Seller Onboarding 核心骨架已成立
* Cloud / DynamoDB / Lambda 状态真实、可验证
* Lambda / Frontend / Backend 边界已明确并冻结
* 所有关键决策已冻结并写入文档
* 本文件是 **新 Session 的唯一进度真相源**
