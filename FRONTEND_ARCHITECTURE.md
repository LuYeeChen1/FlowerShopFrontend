好，这里我直接给你一份**「项目无关、可长期复用」的前端 Clean Architecture 规范文档**。
**不绑定 FlowerShop、不绑定 Vue / React、不绑定具体技术栈**，而是**理念 + 可落地结构**。

你可以把它当成：

* 📄 团队规范
* 📄 AI / Codex System Prompt 的一部分
* 📄 任意中大型前端项目的冻结架构文档

下面内容我会**直接以 `.md` 正文形式给你**，你可以原样保存。

---

````md
# Frontend Clean Architecture Canon

> 目标：在前端项目中实现 **长期可维护、可演进、框架可替换** 的架构，
> 通过清晰的分层与依赖规则，防止业务逻辑腐烂。

---

## 1. 设计原则（Design Principles）

### 1.1 核心目标

- **业务逻辑独立于 UI**
- **业务逻辑独立于框架**
- **业务逻辑独立于通信方式（HTTP / GraphQL / Mock）**
- UI 可重写，业务不动

### 1.2 不追求的目标

- 不追求文件最少
- 不追求“看起来很高级”
- 不强制所有项目都用（小项目可不用）

---

## 2. 总体分层（Layer Overview）

前端 Clean Architecture 采用**由内向外**的分层模型：

```text
[ Domain ]
    ↑
[ Application ]
    ↑
[ Interface Adapter ]
    ↑
[ Infrastructure ]
    ↑
[ UI / Framework ]
````

### 核心依赖规则（Dependency Rule）

> **所有依赖只能指向内层，禁止反向依赖**

* Domain 不依赖任何外层
* Application 不依赖 UI / Framework
* UI 永远不能包含业务规则

---

## 3. 各层职责定义（Layer Responsibilities）

---

## 3.1 Domain Layer（领域层）

### 职责

* 描述**业务是什么**
* 表达业务规则、约束、不变量
* 不关心“怎么展示”“怎么请求接口”

### 允许内容

* Entity / Value Object
* Domain Rule
* Validator
* Domain Enum / 常量

### 禁止内容

* HTTP / fetch / axios
* UI 状态
* Framework API
* LocalStorage / Cookie

### 示例

```text
domain/
 ├─ model/
 │   └─ User.ts
 ├─ rule/
 │   └─ CanSubmitOrderRule.ts
 └─ validator/
     └─ EmailValidator.ts
```

> **Domain 层代码应可以被直接拷贝到 Node.js / 后端而无需修改**

---

## 3.2 Application Layer（应用层 / Use Case）

### 职责

* 描述**用户做了一件事会发生什么**
* 编排 Domain 对象与规则
* 定义对外部世界的“需求接口（Port）”

### 允许内容

* UseCase / Application Service
* Port（接口定义）
* 业务流程控制

### 禁止内容

* 直接使用 HTTP / SDK
* 操作 UI 状态
* 引入框架依赖

### 示例

```text
application/
 ├─ usecase/
 │   └─ SubmitOrderUseCase.ts
 └─ port/
     ├─ OrderApiPort.ts
     └─ AuthPort.ts
```

---

## 3.3 Interface Adapter Layer（接口适配层）

### 职责

* 在 **UseCase 世界** 与 **UI 世界** 之间做翻译
* 将业务结果转换为 UI 可消费的状态

### 核心概念

* ViewModel
* Presenter

### 允许内容

* 状态映射
* 错误映射
* UI 友好结构转换

### 禁止内容

* 直接访问 DOM
* 编写业务规则

### 示例

```text
interfaceadapter/
 ├─ viewmodel/
 │   └─ OrderViewModel.ts
 └─ presenter/
     └─ OrderPresenter.ts
```

> **ViewModel = 前端的 Controller**

---

## 3.4 Infrastructure Layer（基础设施层）

### 职责

* 提供 Application Layer 所需 Port 的**具体实现**
* 封装第三方技术细节

### 允许内容

* HTTP 实现
* SDK 调用
* Storage（localStorage / indexedDB）
* Auth Provider

### 示例

```text
infrastructure/
 ├─ api/
 │   └─ OrderApiHttp.ts
 ├─ auth/
 │   └─ AuthProvider.ts
 └─ storage/
     └─ TokenStorage.ts
```

> **Infrastructure 可以被替换，但 Application 不需要改**

---

## 3.5 UI / Framework Layer（表现层）

### 职责

* 页面展示
* 事件绑定
* 路由切换

### 允许内容

* 组件
* 页面
* 样式
* 框架生命周期

### 禁止内容

* 业务规则
* 直接操作 Domain

### 示例

```text
ui/
 ├─ pages/
 │   └─ OrderPage.vue
 └─ components/
     └─ OrderForm.vue
```

---

## 4. 数据与控制流（Flow）

### 4.1 用户操作流

```text
User Action
   ↓
UI Component
   ↓
ViewModel
   ↓
UseCase
   ↓
Domain
```

### 4.2 外部调用流

```text
UseCase
   ↓
Port (Interface)
   ↓
Infrastructure Implementation
```

---

## 5. 架构约束（Hard Rules）

### 必须遵守

* UI 层 **不得** 引入 Domain Rule
* UseCase **不得** import Framework
* Domain **不得** import 任何外部库

### 建议遵守

* 一个文件只做一件事
* UseCase 名字使用动词（Submit / Apply / Get）
* Domain 名字使用名词

---

## 6. 适用范围判断

### 推荐使用

* 多角色系统
* 复杂状态流转
* 中大型前端项目
* 生命周期 ≥ 1 年

### 不推荐使用

* 简单展示页
* 一次性 Demo
* 表单 + CRUD 小工具

---

## 7. 核心价值总结

> **前端 Clean Architecture 的价值不是“分层”，而是：**

* UI 可变，业务稳定
* 技术可换，规则不动
* 项目越大，维护成本越低

---

## 8. 结束语

Clean Architecture 不是银弹。
但在复杂前端项目中，它是**最可靠的长期结构选择之一**。

```

---

如果你愿意，下一步我可以帮你做三件事之一（一次只做一件）：

1. 把这份文档**压缩成 Codex / AI System Prompt 版本**
2. 写一份 **Frontend + Backend 共用的 Clean Architecture Canon**
3. 给你一份 **“什么时候不要用 Clean Architecture”的反模式清单**

你选一个，我继续。
```
