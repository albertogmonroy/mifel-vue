import { createApp } from "vue";
import "./style.css";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import userStore from "./store/index";
import axios from "./config/axiosConfig";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primevue/resources/themes/aura-light-green/theme.css";
import "primeflex/primeflex.scss";
import "primevue/resources/primevue.min.css";

const app = createApp(App);
app.use(PrimeVue);
app.use(userStore);
app.config.globalProperties.$axios = axios;
app.mount("#app");
