import config from '~/config';

// Pages
import Home from '~/pages/Home';
import Login from '../pages/Login';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
//admin
import Dashboard from '../pages/Dashboard';
import Calendar from '../pages/Calendar';
import AdminProfile from '../pages/AdminProfile';
import AccountManagement from '../pages/AccountManagement';

// Public routes
const publicRoutes = [
  { path: '/', component: Home },
  { path: config.routes.login, component: Login, layout: null },
  { path: '/following', component: Following },
  { path: '/profile', component: Profile },
];

const adminRoutes = [
  { path: config.routes.dashboard, component: Dashboard, layout: null },
  { path: config.routes.calendar, component: Calendar, layout: null },
  { path: config.routes.adminProfile, component: AdminProfile, layout: null },
  { path: config.routes.accountManagement, component: AccountManagement, layout: null },
];

export { publicRoutes, adminRoutes };
