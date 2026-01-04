// src/layouts/app/nav.ts
// 作用：集中管理 AppLayout 的导航（最薄，改一次全局生效）

export type NavItem = { label: string; to: string };

export const APP_NAV: NavItem[] = [
  { label: "Me", to: "/app/me" },
  { label: "Orders", to: "/app/orders" },
  { label: "Products", to: "/app/products" },
  { label: "Admin", to: "/app/admin" },
];