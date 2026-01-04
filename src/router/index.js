// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "../layouts/AppLayout.vue";

// Home = Cognito Auth
import Auth from "../pages/Auth.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Auth,
  },

  // OAuth 回调页：Cognito 登录成功后会跳到这里
  {
    path: "/callback",
    name: "Callback",
    component: () => import("../pages/Callback.vue"),
  },

  // 旧地址兼容：/me 自动跳到 /app/me
  {
    path: "/me",
    redirect: "/app/me",
  },

  // 已登录区域：统一 Layout + Header
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
