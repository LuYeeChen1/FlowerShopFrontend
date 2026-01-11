import { createRouter, createWebHistory } from "vue-router";
import menuRoutes from "./menuRoutes";
import customerRoutes from "./customer";
import sellerRoutes from "./seller";
import adminRoutes from "./admin";

const routes = [
  ...menuRoutes,
  ...customerRoutes,
  ...sellerRoutes,
  ...adminRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
