import { createRouter, createWebHistory } from 'vue-router';
import Landing from './components/Landing.vue';
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';
import Homepage from './components/Homepage.vue';
import EmailVerification from './components/EmailVerification.vue';
import Packages from './components/packages.vue'; // Import Packages component

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/email-verification', component: EmailVerification }, // New route
  { path: '/home', component: Homepage },  // Secure page after login
  { path: '/packages', component: Packages },  // Route for Packages component
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;