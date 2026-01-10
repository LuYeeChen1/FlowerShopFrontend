# FlowerShop — Current Process (Frontend ↔ Cognito)

## Current State (Already Done)
- AWS Cognito User Pool 已存在
- Cognito 内部设计 **未删除**，仍按 Console 中现有配置为准：
  - App Client
  - Hosted UI Domain
  - Callback / Logout URLs
  - Attributes / Groups / Triggers（如有）
- 前端代码：已全部删除
- 后端代码：已全部删除
- Lambda / API Gateway / DynamoDB：已全部删除

## What You Need To Do (Now)
- 从零开始实现 **Frontend**
- 前端直接对接 **现有 Cognito**
- 完成用户：
  - 注册（Sign up）
  - 登入（Sign in）
  - Callback 后获取并管理 token
  - 登出（Sign out）
- 不需要后端
- 不需要改动 Cognito 设计
- 以「最简单可工作的实现」为目标

## Goal
前端可独立完成 Cognito 的注册与登入闭环，并可作为后续后端接入的基础。
