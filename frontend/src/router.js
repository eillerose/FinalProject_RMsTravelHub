import { createRouter, createWebHistory } from 'vue-router';
import AboutUs from './components/AboutUs.vue';
import Activities from './components/Activities.vue';
import Booking from './components/Booking.vue';
import ContactUs from './components/ContactUs.vue';
import EditProfile from './components/EditProfile.vue';
import EmailVerification from './components/EmailVerification.vue';
import Feedback from './components/Feedback.vue';
import Homepage from './components/Homepage.vue';
import Hotel from './components/Hotel.vue';
import Landing from './components/Landing.vue';
import Login from './components/Login.vue';
import Packages from './components/Packages.vue';
import Signup from './components/Signup.vue';
import TourGuide from './components/TourGuide.vue';
import { getAuth } from 'firebase/auth';

const routes = [
  { path: '/', component: Landing },
  { path: '/aboutus', component: AboutUs },
  { path: '/activities', component: Activities },
  { path: '/booking', component: Booking },
  { path: '/contactus', component: ContactUs },
  { path: '/edit-profile', component: EditProfile, meta: { requiresAuth: true } },
  { path: '/email-verification', component: EmailVerification },
  { path: '/feedback', component: Feedback },
  { path: '/home', component: Homepage, meta: { requiresAuth: true, requiresVerification: true } },
  { path: '/hotel', component: Hotel },
  { path: '/login', component: Login },
  { path: '/packages', component: Packages },
  { path: '/signup', component: Signup },
  { path: '/tour-guide', component: TourGuide },
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
