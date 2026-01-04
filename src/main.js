// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./style.css"; // 引入 Tailwind 全局样式（关键）

createApp(App).use(router).mount("#app");
