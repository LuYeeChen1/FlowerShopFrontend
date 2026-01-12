import AdminHome from "../../ui/pages/admin/AdminHome.vue";

const adminFeatureRoutes = [
  {
    path: "/admin",
    name: "AdminHome",
    component: AdminHome,
    meta: { requiresAuth: true, requiredGroups: ["ADMIN"] },
  },
];

export default adminFeatureRoutes;
