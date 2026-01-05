// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "../layouts/AppLayout.vue";

// Home = Cognito Auth（未登录）
import Auth from "../pages/Auth.vue";

const routes = [
  // 登录入口（Cognito Hosted UI）
  {
    path: "/",
    name: "Home",
    component: Auth,
  },

  // OAuth 回调页：Cognito 登录成功后跳转
  {
    path: "/callback",
    name: "Callback",
    component: () => import("../pages/Callback.vue"),
  },

  // Cognito logout redirect 落地页
  {
    path: "/signed-out",
    name: "SignedOut",
    component: () => import("../pages/SignedOut.vue"),
  },

  // 旧地址兼容：/me → /app/me
  {
    path: "/me",
    redirect: "/app/me",
  },

  // 已登录区域：统一 Layout
  {
    path: "/app",
    component: AppLayout,
    children: [
      {
        path: "me",
        name: "Me",
        component: () => import("../pages/Me.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
