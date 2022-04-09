import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VirtualList from "./pulgins/virtual-list";

createApp(App).use(router).use(VirtualList).mount("#app");
