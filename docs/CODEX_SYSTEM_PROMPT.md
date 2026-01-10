收到，这次意思很清楚了 👍
**不是删标题，也不是改措辞，而是：**

> 👉 **把「与 AI / Codex 工作规则重叠的部分」从这个 Canon 里彻底移除**
> 👉 只保留**架构宪法 + 系统职责 + 冻结事实**
> 👉 **工作方式 / 切片 / 输出规范** 应该只存在于 *AI_WORK_RULES / WORK_RULES*，不要在这里重复

下面是**已清理后的版本**，我做了三件事：

* ✅ **完整删除 Section C：Codex 工作规则（Working Rules）**
* ✅ 不动 A / B 的任何架构与职责约束（这些是 Canon，应保留）
* ✅ 文件性质从「System Prompt」降级为 **Architecture Canon（与人/AI无关）**

---

````md
# ARCHITECTURE_CANON.md
# FlowerShop – Architecture Canon (Frozen)

本文件定义 **FlowerShop 项目的架构宪法与系统职责边界**。  
适用于 **人类开发者与任何自动化工具**。  
本文件 **不描述工作方式、不描述切片规则、不描述输出规范**。

==================================================

## A) 架构宪法（Architecture Canon）

### A.1 架构目标（冻结）

- FlowerShop 以前端（Frontend）与 Spring Boot Java 为**核心系统**
- AWS 在 **0 成本** 前提下参与到可用的极限
- AWS 仅作为 **能力外包与基础设施助手**
- 职责边界清晰、不可越界
- 前后端完全分离，仅 REST API 通信

---

### A.2 系统主次关系（冻结）

- 主系统：
  - Frontend
  - Spring Boot Backend (Java)

- 辅助系统（AWS）：
  - Cognito
  - API Gateway
  - Lambda
  - DynamoDB
  - S3
  - IAM
  - CloudWatch

**业务解释权永远不属于 AWS。**

---

### A.3 全局结构（冻结）

```text
[ Frontend (Browser) ]
        |
        | HTTPS + JWT
        v
[ Spring Boot Backend (Java, REST API) ]
        |
        +--> DynamoDB (Business Facts)
        |
        +--> S3 (Files)
        |
        +--> Lambda (Assistant Execution Unit)
        |
        +--> Cognito (Identity via Tokens)

[ API Gateway ] —— 仅作为 Lambda 的公网入口
[ IAM ] —— 最小权限
[ CloudWatch ] —— 日志
````

---

### A.4 全局原则（冻结）

1. 身份 ≠ 业务
2. 前端不可信
3. 业务写入必须受控（Spring Boot 唯一入口）
4. 业务规则只有一个权威来源（以 Spring Boot 为准）
5. AWS 不编排业务流程
6. 0 成本是硬约束

---

### A.5 全局禁止（冻结）

❌ 前端直连任何 AWS 数据服务
❌ Lambda 改写核心业务事实（订单 / 库存 / 商品等）
❌ 在多个组件重复实现同一业务规则
❌ 在 Cognito / S3 存业务状态
❌ 引入稳定收费组件（NAT Gateway / RDS / Secrets Manager）

==================================================

## B) 核心组件职责（冻结）

### B.1 Frontend

做：

* UI 渲染
* 用户交互
* 调用 Spring Boot REST API
* 存储并携带 Access Token

不做：

* 业务判断
* 权限判断
* 身份解释
* AWS SDK 调用
* 直写 DynamoDB / S3

---

### B.2 Spring Boot Backend (Java)

系统地位：

* 业务规则唯一来源
* 业务状态唯一解释者
* 业务写入唯一控制点

做：

* Seller / Product / Order / Inventory 规则
* 权限裁决（JWT Claims + 业务事实）
* 业务事实写入（DynamoDB）
* 文件流程编排（S3 pre-signed URL + metadata）
* 对外 REST API（系统唯一业务入口）

不做：

* 登录 / 注册
* Token 签发
* 将裁决权下放给 Lambda
* Controller 承载业务逻辑
* 存 token / session

---

### B.3 Lambda（外包执行单元）

系统定位：

* Lambda 是 **被调用的执行器**，不是系统大脑

做（仅限）：

1. AWS 强耦合动作

   * Cognito Admin（加组 / 移组 / 改属性）
   * SES 邮件
   * AWS 事件入口处理（Cognito Trigger / S3 Event）

2. 短任务 / 异步任务

   * 失败不影响主业务

3. AWS 原生事件响应

不做：

* 成为第二后端
* 承载完整业务流程
* 改写核心业务事实
* 拥有业务裁决权

---

### B.4 Cognito

做：

* 用户认证
* Token 签发
* User Pool
* Groups：CUSTOMER / SELLER / ADMIN
* Custom Attributes（如 role_stage）

不做：

* 业务数据
* 业务流程
* 业务授权裁决

---

### B.5 DynamoDB

做：

* 存储业务事实

不做：

* 存 token / session
* 存文件
* 存“是否登录”的影子副本

---

### B.6 S3

做：

* 存文件本体

规则：

* 通过 Spring Boot 生成 pre-signed URL
* 文件 metadata 存 DynamoDB

不做：

* 存业务状态
* 权限裁决

==================================================

## 最终冻结声明

> **Spring Boot 决定业务真相，
> Frontend 负责交互，
> AWS 只是被调用的工具箱。**

==================================================