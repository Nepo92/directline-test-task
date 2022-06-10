import { createApp } from "vue";
import App from "./App.vue";
import Multiselect from "vue-multiselect";

const app = createApp(App);

app.component(Multiselect);

app.mount("#app");
