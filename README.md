# FlowerShop Frontend

FlowerShop 的 **Frontend（顾客端）项目**。  
本仓库仅负责 **用户界面与交互层**，不承载业务规则，也不直接接触 AWS。

---

## 文档阅读顺序（必须按顺序）

所有关键约束与事实都在 `docs/` 目录中，**实现前必须先读文档**。

1. **`ARCHITECTURE_CANON.md`**  
   架构宪法（冻结）  
   定义系统整体边界与不可违背的原则。

2. **`SYSTEM_RESPONSIBILITIES.md`**  
   系统职责边界（冻结）  
   明确 Frontend / Spring Boot / Lambda / AWS 各自能做什么、不能做什么。

3. **`CUSTOMER_FUNCTIONAL_REQUIREMENTS_FINAL.md`**  
   CUSTOMER 端完整功能需求说明书（最终版）  
   定义顾客“能做什么”，不涉及实现方式。

4. **`FRONTEND_ARCHITECTURE.md`**  
   前端内部架构说明（Clean Architecture）。

5. **`CURRENT_PROCESS.md`**  
   当前项目所处阶段与下一步工作范围。

6. **`AI_WORK_RULES.md`**  
   AI / Codex 的工作方式与协作规则（仅约束工作流程）。
---

> 本仓库的所有实现，必须遵守上述文档中的冻结约束。
