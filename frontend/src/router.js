import { createRouter, createWebHistory } from 'vue-router';
import Landing from './components/Landing.vue';
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';
import Homepage from './components/Homepage.vue';
import AboutUs from './components/AboutUs.vue';
import EditProfile from './components/EditProfile.vue';
import Feedback from './components/Feedback.vue';
import ContactUs from './components/ContactUs.vue';
import EmailVerification from './components/EmailVerification.vue';
import { getAuth } from 'firebase/auth';

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/aboutus', component: AboutUs },
  { path: '/feedback', component: Feedback },
  { path: '/contactus', component: ContactUs },
  { path: '/email-verification', component: EmailVerification },
  { path: '/home', component: Homepage, meta: { requiresAuth: true, requiresVerification: true } },
  { path: '/edit-profile', component: EditProfile, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!user) {
      next('/login'); // Redirect to login if not authenticated
    } else if (to.matched.some(record => record.meta.requiresVerification) && !user.emailVerified) {
      next('/email-verification'); // Redirect to email verification page if not verified
    } else {
      next(); // Proceed to the route if authenticated and verified
    }
  } else {
    next(); // Proceed if no authentication or verification is required
  }
});

export default router;
