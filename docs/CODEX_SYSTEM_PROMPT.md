# ARCHITECTURE_CANON.md
# FlowerShop – Architecture Canon (Frozen)

本文件定义 **FlowerShop 项目的架构宪法与冻结事实**。  
适用于 **人类开发者与任何自动化工具**。  
本文件 **不描述工作方式、不描述切片规则、不描述输出规范**。  
本文件 **不描述任何组件的职责清单**（职责边界见独立文件）。

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
A.4 全局原则（冻结）
身份 ≠ 业务

前端不可信

业务写入必须受控（Spring Boot 唯一入口）

业务规则只有一个权威来源（以 Spring Boot 为准）

AWS 不编排业务流程

0 成本是硬约束

A.5 全局禁止（冻结）
❌ 前端直连任何 AWS 数据服务
❌ Lambda 改写核心业务事实（订单 / 库存 / 商品等）
❌ 在多个组件重复实现同一业务规则
❌ 在 Cognito / S3 存业务状态
❌ 引入稳定收费组件（NAT Gateway / RDS / Secrets Manager）

==================================================

最终冻结声明
Spring Boot 决定业务真相，
Frontend 负责交互，
AWS 只是被调用的工具箱。

==================================================