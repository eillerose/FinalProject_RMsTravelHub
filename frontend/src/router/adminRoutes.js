import AdminPanel from '../views/AdminPanel.vue';
import Dashboard from '../views/Dashboard_admin.vue';
import Logbook from '../views/Logbook_admin.vue';
import Packages from '../views/Packages_admin.vue';
import Activities from '../views/Activities_admin.vue';
import Staffs from '../views/Staffs_admin.vue';
import Booking from '../views/Booking_admin.vue';
import AdminCalendar from '../views/AdminCalendar.vue';
import Hotel from '../views/Hotel_admin.vue';
import Guest from '../views/Guest_admin.vue';
import Feedback from '../views/Feedback_admin.vue';
import PackageOptions from '../views/PackageOptions.vue';

const adminRoutes = [
  {
    path: '/admin',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', component: Dashboard },
      { path: 'dashboard', component: Dashboard },
      { path: 'logbook', component: Logbook },
      { path: 'packages', component: Packages },
      { path: 'activities', component: Activities },
      { path: 'staffs', component: Staffs },
      { path: 'hotels', component: Hotel },
      { path: 'booking', component: Booking },
      { path: 'booking/calendar', component: AdminCalendar },
      { path: 'guest', component: Guest },
      { path: 'feedback', component: Feedback },
      { path: 'options', component: PackageOptions },
    ],
  },
];

export default adminRoutes;