import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import DatePicker from "./components/DatePicker.vue";

const app = createApp(App);
app.component("DatePicker", DatePicker);
app.mount("#app");
