import VirtualList from "./VirtualList.vue";
import type { App } from "vue";
export default {
  install(app: App) {
    app.component("VirtualList", VirtualList);
  },
};
