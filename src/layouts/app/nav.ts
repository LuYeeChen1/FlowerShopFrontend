// src/layouts/app/nav.ts
// Step B：AppLayout 导航配置（新手版）
//
// 这个文件是干嘛的？
// 👉 定义左边 / 顶部菜单有哪些项
//
// 为什么单独放一个文件？
// - 改导航只改这里
// - AppLayout.vue 不用动
//
// NavItem 代表一条菜单
// - label：显示给用户看的文字
// - to：点击后跳转的路由

export type NavItem = { label: string; to: string };

// 应用内的主导航菜单
export const APP_NAV: NavItem[] = [
  { label: "Me", to: "/app/me" },
  { label: "Orders", to: "/app/orders" },
  { label: "Products", to: "/app/products" },
  { label: "Admin", to: "/app/admin" },
];
