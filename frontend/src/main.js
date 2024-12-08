import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Make sure this points to your router/index.js
// import { Lucide } from 'lucide-vue-next';

const app = createApp(App);
app.use(router);
// app.use(Lucide);
app.mount('#app');

