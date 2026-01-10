// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../ui/pages/Home.vue";
import Callback from "../ui/pages/Callback.vue";
import SignedOut from "../ui/pages/SignedOut.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/callback",
    name: "Callback",
    component: Callback,
  },
  {
    path: "/signed-out",
    name: "SignedOut",
    component: SignedOut,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
