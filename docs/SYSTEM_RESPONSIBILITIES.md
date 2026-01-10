# SYSTEM_RESPONSIBILITIES.md
# FlowerShop – System Responsibilities (Frozen)

本文件定义 **FlowerShop 的组件职责边界**。  
本文件只描述 **系统职责与禁止事项**，不描述工作方式、切片规则或输出规范。  
与 ARCHITECTURE_CANON.md 配套使用。

==================================================

## B) 核心组件职责（冻结）

### B.1 Frontend

做：

- UI 渲染
- 用户交互
- 调用 Spring Boot 提供的 REST API
- 存储并携带 Access Token

不做：

- 任何业务判断
- 权限裁决
- 身份解释
- AWS SDK 调用
- 直连任何数据库或对象存储

---

### B.2 Spring Boot Backend (Java)

系统地位：

- **核心业务系统**
- **业务规则唯一权威**
- **业务事实唯一写入点**

做（仅限）：

- 业务规则处理（Customer / Seller / Product / Order / Inventory 等）
- 权限裁决（基于 JWT Claims + MySQL 中的业务事实）
- 业务事实的读写与一致性保证
- MySQL 数据模型与事务边界维护
- 对外提供 REST API（系统唯一业务入口）

不做：

- 登录 / 注册
- Token 签发或刷新
- 直接调用 AWS SDK
- 直接访问 S3 / DynamoDB / Cognito
- 处理 AWS 资源生命周期
- 承载任何 AWS 侧执行逻辑
- Controller 中编写业务逻辑

**原则：Spring Boot 只关心业务，不关心 AWS。**

---

### B.3 Lambda（AWS 代理人 / Execution Agent）

系统定位：

- **Lambda 是 AWS 的代理人**
- **代表系统执行所有 AWS 侧动作**
- **不拥有业务解释权**

做（仅限）：

1) AWS 强耦合操作的代理执行

   - Cognito Admin 操作（加组 / 移组 / 改属性）
   - S3 文件操作（由系统触发）
   - SES / SNS 等 AWS 原生服务调用
   - AWS 原生事件处理（Cognito Trigger / S3 Event）

2) 被动执行 Spring Boot 或 AWS 事件指令

   - 接收明确指令
   - 执行后返回结果
   - 不保留业务状态

3) 短生命周期、可丢弃的执行任务

不做：

- 决定业务规则
- 解释业务状态
- 直接操作 MySQL
- 成为“第二后端”
- 编排完整业务流程
- 在多个 Lambda 中复制业务判断

**原则：Lambda 只知道“怎么调用 AWS”，不知道“为什么”。**

---

### B.4 Cognito

做：

- 用户身份认证
- Token 签发
- User Pool 管理
- Groups：CUSTOMER / SELLER / ADMIN
- Custom Attributes（如 role_stage）

不做：

- 存储业务事实
- 执行业务流程
- 业务授权裁决

---

### B.5 MySQL

做：

- **存储所有核心业务事实**
- 作为业务状态的唯一持久化来源
- 支持事务、一致性与关系约束

不做：

- 身份认证
- 文件存储
- Token / Session 存储

---

### B.6 DynamoDB（如存在）

做：

- 存储 **非核心、可再生、去中心化的数据**
- 仅作为 AWS 侧辅助存储

不做：

- 存储核心业务事实
- 替代 MySQL
- 承担系统一致性责任

---

### B.7 S3

做：

- 存储文件本体（图片 / 文档等）

规则：

- 文件的业务含义与元数据 **不在 S3 决定**
- S3 仅作为 Blob Storage

不做：

- 存储业务状态
- 权限裁决
- 决定文件归属关系

==================================================

## 最终冻结声明

> **业务事实在 MySQL，  
> 业务规则在 Spring Boot，  
> AWS 行为由 Lambda 代理执行。**

==================================================
这一版的逻辑核心（帮你确认一遍）
✅ Spring Boot = 纯业务系统

只关心：规则、状态、一致性、MySQL

完全“看不见 AWS”

✅ Lambda = AWS 的手和脚

帮系统“按按钮”

不思考、不判断、不记忆

✅ AWS = 外包工具箱

不拥有任何业务解释权