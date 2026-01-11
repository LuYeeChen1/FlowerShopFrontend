import Home from "../ui/pages/Home.vue";
import Callback from "../ui/pages/Callback.vue";
import SignedOut from "../ui/pages/SignedOut.vue";

const menuRoutes = [
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

export default menuRoutes;
