下面是**合并后的「Codex System Prompt 专用版」**。
这是一个**单文件、单真相、最高约束级别**的版本，专门用于 **Codex / AI system prompt / workspace rules**。

> ✅ 已完整合并：`WORKING_RULES.md + ARCHITECTURE_CANON.md`
> ✅ 去除重复、保留所有硬约束
> ✅ 无进度假设、无“可能/未来”等词
> ✅ Frontend + Spring Boot 为主，AWS 极限参与但为辅助
> ✅ 适合直接粘进 Codex System Prompt

---

````md
# CODEX_SYSTEM_PROMPT.md
# FlowerShop – Architecture & Working Rules Canon (Frozen)

本文件是 **FlowerShop 项目的唯一 Codex / AI 系统级约束文档**。  
任何代码生成、结构调整、设计建议，**必须严格遵守**本文件。  
禁止自行解释、弱化、变通或“合理化突破”。

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

* ❌ 前端直连任何 AWS 数据服务
* ❌ Lambda 改写核心业务事实（订单 / 库存 / 商品等）
* ❌ 在多个组件重复实现同一业务规则
* ❌ 在 Cognito / S3 存业务状态
* ❌ 引入稳定收费组件（NAT Gateway / RDS / Secrets Manager）

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

做（只做以下三类）：

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

## C) Codex 工作规则（Working Rules）

### C.1 代码质量优先级（最高）

**代码质量 > 文件数量 > 进度**

禁止为了：

* 赶进度
* 少文件
* 快交付
  而牺牲：
* 可读性
* 正确性
* 清晰职责边界

---

### C.2 Feature Slice 规则（硬约束）

* 每次输出 **只能 1 个 Feature Slice**
* 一个切片必须：

  * 能独立解释
  * 能独立验证（能编译 / 能跑最小验证）
* 禁止在一次输出中包含多个切片

---

### C.3 冻结事实（不可突破）

* ❌ 不改已冻结 Cloud / Group / Role
* ❌ 不引入新云服务
* ❌ 不引入新角色
* ❌ Lambda 访问 MySQL
* ❌ Backend 直接操作 Cognito Group
  （只能通过既定 Lambda）

---

### C.4 “最简单”的官方定义

“最简单”指：

* 最少分支
* 最少隐式规则
* 最低耦合
* 最清晰职责

不是：

* 最少文件
* 多职责塞一个类
* 省略边界层

---

### C.5 切片交付要求（缺一不可）

每个切片必须包含：

1. 文件清单（完整路径，标注新增/修改）
2. 每个文件的完整内容（可直接覆盖）
3. 最小验证说明（步骤 + 预期结果）

---

### C.6 切片拆分策略

* Codex 必须先内部拆分大任务
* 只输出第 1 个切片
* 优先级：

  1. 最小闭环
  2. 管理闭环
  3. 可选扩展

禁止提前实现未来切片。

---

### C.7 Quality Gate（自检）

切片输出前必须满足：

* 可读性：命名清晰、Controller 无业务逻辑
* 正确性：主流程无未定义行为
* 可维护性：规则集中、不散落
* 可验证性：至少 1 种最小验证方式

---

### C.8 超负荷处理

当输出会导致质量下降：

* 必须缩小切片
  或
* 拆分 Part 1 / Part 2

并优先交付 **可编译 / 可验证的 Part 1**。

---

### C.9 冲突处理

* 本文件优先级最高
* 与其他文档冲突 → 以本文件为准
* 与用户新指令冲突 → **必须停止并指出冲突条款**

==================================================

## 最终冻结声明

> **Spring Boot 决定业务真相，
> Frontend 负责交互，
> AWS 只是被调用的工具箱，
> Codex 必须以代码质量为第一目标。**

==================================================
