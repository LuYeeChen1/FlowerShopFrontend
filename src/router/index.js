import { createRouter, createWebHistory } from "vue-router";
import { authContainer } from "../infrastructure/composition/container";
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

const decodeJwtPayload = (token) => {
  if (!token) {
    return null;
  }
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  try {
    return JSON.parse(atob(padded));
  } catch (error) {
    return null;
  }
};

const getAuthState = () => {
  const session = authContainer.getSessionUseCase.execute();
  if (!session || session.isExpired()) {
    return { isAuthenticated: false, groups: [] };
  }
  const payload = decodeJwtPayload(session.idToken);
  const rawGroups = payload?.["cognito:groups"];
  const groups = Array.isArray(rawGroups) ? rawGroups : rawGroups ? [rawGroups] : [];
  return { isAuthenticated: true, groups };
};

router.beforeEach((to) => {
  const { isAuthenticated, groups } = getAuthState();
  if (isAuthenticated && groups.includes("ADMIN") && to.path === "/") {
    return { path: "/admin" };
  }
  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth);
  if (!requiresAuth) {
    return true;
  }
  const requiredGroups = to.matched
    .flatMap((record) => record.meta?.requiredGroups || [])
    .filter((group, index, self) => self.indexOf(group) === index);
  const hasRequiredGroups =
    requiredGroups.length === 0 || requiredGroups.some((group) => groups.includes(group));
  if (!isAuthenticated || !hasRequiredGroups) {
    return { path: "/" };
  }
  return true;
});

export default router;
