明白。下面只给**前端通用 Clean Architecture 架构**：分层、依赖方向、每层放什么、不放什么、目录模板与边界规则。没有任何“AI/Codex职责”。

---

# Frontend Clean Architecture（通用版）

## 1) 目标与约束

### 目标

* 业务逻辑可测试、可复用、可替换 UI/框架
* 网络/存储/路由等外部细节可替换
* 代码结构稳定：新增功能主要“加文件”，不是“改一堆旧文件”

### 核心约束：依赖方向

只允许 **外层 → 内层** 依赖：

`UI(views/components)` → `Application(usecases)` → `Domain`
`Infrastructure(adapters)` → 依赖 `Application` 的 ports 并实现它
`Domain` 不依赖任何外部（框架/浏览器/网络/状态库）

---

## 2) 分层定义（职责边界）

## 2.1 Domain（领域层：纯业务）

**放什么**

* Entities（实体）、Value Objects（值对象）
* 领域规则/计算（纯函数或纯方法）
* 领域错误（DomainError）
* 领域服务（如果确实需要：跨实体的纯规则）

**不放什么**

* HTTP / fetch / axios
* localStorage / sessionStorage / cookie
* router、UI 状态、组件、hooks
* 第三方 SDK
* 框架类型（React/Vue 特有类型）

**特点**

* 纯 TypeScript（或纯 JS），可在 Node 环境跑测试
* 业务规则的唯一可信来源

---

## 2.2 Application（应用层：用例编排）

**放什么**

* UseCase（用例）：以“用户意图/动作”命名

  * 例：`Login`, `GetMe`, `CreateOrder`, `SubmitOnboarding`
* 应用级 DTO（输入/输出模型）
* 用例级错误（UseCaseError，可选）
* ports（接口）的调用编排：先后顺序、聚合、转换

**不放什么**

* UI 框架代码（组件、hooks、store 具体实现）
* 直接 fetch/localStorage/router
* 复杂业务规则（应下沉到 Domain）

**特点**

* 不知道“界面长什么样”，只知道“要完成什么动作”
* 只通过 **Ports** 接触外部世界

---

## 2.3 Ports（端口：对外依赖的抽象接口）

> 有些团队把 ports 放在 application 内部，这也可以；关键是：**它们是接口，不是实现**。

**放什么**

* `ApiPort`：后端请求抽象（如 `UserApiPort`, `OrderApiPort`）
* `StoragePort`：token/缓存读写抽象
* `ClockPort`：时间抽象（可选）
* `LoggerPort`：日志抽象（可选）

**不放什么**

* 任何实现（不写 fetch / localStorage）
* 任何框架/浏览器 API

**特点**

* Application 通过 ports “声明需要什么能力”
* Infrastructure 负责提供实现

---

## 2.4 Infrastructure（基础设施：适配器/实现）

**放什么**

* HTTP 适配器：`fetch/axios` 实现各类 `*ApiPort`
* 存储适配器：`localStorage/sessionStorage` 实现 `StoragePort`
* 第三方 SDK 适配器（如 Cognito SDK 包装成 port 实现）
* 配置加载（env/config）与实例装配（composition root）

**不放什么**

* 业务规则（Domain 的活）
* 用例编排（Application 的活）
* UI 展示（UI 的活）

**特点**

* 外界变化（HTTP 细节、SDK、存储方案）通常只改这里

---

## 2.5 UI（界面层：页面/组件/状态）

**放什么**

* 页面、组件、UI 状态管理（store）
* 表单输入收集、展示 loading/error
* 调用 usecase、渲染结果
* 路由声明（routes）

**不放什么**

* 业务规则（Domain）
* 用例流程编排（Application）
* 外部细节直接调用（fetch/localStorage）——除非这是最外层装配处

**特点**

* UI 的改动不应该迫使 Domain/Application 改动

---

## 3) 数据模型边界（最重要的隐形坑）

为了避免层间“模型污染”，建议使用三类模型：

1. **Domain Models**：领域实体/值对象（严谨、含规则）
2. **DTO（Application/Ports）**：用例输入输出、接口传输（扁平、可序列化）
3. **View Models（UI）**：只为展示服务（可能合并字段、格式化）

**转换位置建议**

* `Infrastructure`：API JSON ↔ DTO
* `Application`：DTO ↔ Domain（创建实体/调用规则/输出 DTO）
* `UI`：UseCase 输出 ↔ ViewModel（格式化）

---

## 4) 目录结构模板（框架无关）

> 这是一种清晰且常用的组织方式。你可以按 feature 切，也可以按 layer 切；下面给一个“按层 + feature 聚合”的折中结构。

```
src/
  domain/
    entities/
    values/
    errors/
    services/              # 仅纯领域服务

  application/
    usecases/
      <feature>/
        <Feature>UseCase.ts
        dto.ts
        errors.ts          # 可选
    ports/
      api/
      storage/
      clock/
      logger/

  infrastructure/
    http/
      client.ts            # fetch/axios 封装（最薄）
      adapters/            # 实现 api ports
    storage/
      adapters/            # 实现 StoragePort
    composition/
      container.ts         # 依赖注入/实例装配（Composition Root）
    config/
      env.ts

  ui/
    pages/
    components/
    stores/                # pinia/redux/zustand 等
    router/
    viewmodels/
```

---

## 5) 最小装配规则（Composition Root）

必须存在**唯一装配点**（例如 `infrastructure/composition/container.ts`）：

* 由这里创建 ports 的具体实现（http/storage/sdk）
* 将实现注入给 usecases（或注入给 application service）
* UI 只从这里拿到“可调用的用例入口”（或 usecase factory）

> 目的：避免 UI 到处 new Adapter / new Client，导致依赖散落。

---

## 6) 允许的“依赖关系清单”

✅ 允许：

* UI → application（调用 usecase）
* application → domain（调用实体/规则）
* application → ports（接口类型）
* infrastructure → ports（实现接口）
* infrastructure → application（为了装配 usecase）

❌ 禁止：

* domain → 任何外层（application/ui/infrastructure）
* application → infrastructure（用例里直接 import http/storage 实现）
* UI → infrastructure（页面直接 fetch/localStorage）

  * 例外：**唯一装配点**可以接触 infrastructure

---

如果你愿意，我可以再给一份**“超短版（1页）”**，专门用来贴到仓库根目录当约束规范（只包含：分层 + 依赖方向 + 目录模板 + 禁止清单）。
