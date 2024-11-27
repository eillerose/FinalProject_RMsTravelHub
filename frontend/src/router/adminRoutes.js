import AdminPanel from '../views/AdminPanel.vue';
import Dashboard from '../views/Dashboard_admin.vue';
import Logbook from '../views/Logbook_admin.vue';
import Packages from '../views/Packages_admin.vue';
import Staffs from '../views/Staffs_admin.vue';
import Assign from '../views/Assign_admin.vue';
import Hotel from '../views/Hotel_admin.vue';
import Guest from '../views/Guest_admin.vue';
import Feedback from '../views/Feedback_admin.vue';

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
      { path: 'staffs', component: Staffs },
      { path: 'hotels', component: Hotel },
      { path: 'assign', component: Assign },
      { path: 'guest', component: Guest },
      { path: 'feedback', component: Feedback },
    ],
  },
];

export default adminRoutes;