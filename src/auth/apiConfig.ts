// src/auth/apiConfig.ts
// 作用：集中管理后端 API Base URL（来自 Vite 环境变量）

export const API_BASE = import.meta.env.VITE_API_BASE as string;
