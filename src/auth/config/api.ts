// src/auth/config/api.ts
// Step A：后端 API 配置文件
//
// 这个文件是干嘛的？
// 👉 告诉前端：后端 API 的“统一起点地址”
//
// 举例：
// - API_BASE = https://api.xxx.com
// - authFetch("/me") → https://api.xxx.com/me
//
// 这里只放配置，不写请求逻辑。
export const API_BASE = import.meta.env.VITE_API_BASE as string;
