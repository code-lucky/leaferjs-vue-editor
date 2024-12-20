import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import 'tailwindcss/tailwind.css';
import router from './router';
import { createPinia } from 'pinia';
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(Antd)
app.use(pinia)
app.mount('#app')
