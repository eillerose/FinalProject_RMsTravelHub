import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Make sure this points to your router/index.js

const app = createApp(App);
app.use(router);
app.mount('#app');
