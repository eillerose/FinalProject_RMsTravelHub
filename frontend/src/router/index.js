import { createRouter, createWebHistory } from 'vue-router';
import Landing from '../components/Landing.vue';
import Login from '../components/Login.vue';
import Signup from '../components/Signup.vue';
import Homepage from '../components/Homepage.vue';

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/homepage', component: Homepage },  // Secure page after login
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
