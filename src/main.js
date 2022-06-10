import { createApp } from "vue";
import App from "./App.vue";
import Multiselect from '@vueform/multiselect'

const app = createApp(App);
app.component('multiselect', Multiselect)

app.mount("#app");
