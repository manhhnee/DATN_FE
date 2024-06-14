import config from '~/config';

// Pages
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Profile from '~/pages/Profile';
// Admin Pages
import Dashboard from '~/pages/Dashboard';
import Calendar from '~/pages/Calendar';
import AdminProfile from '~/pages/AdminProfile';
import AccountManagement from '~/pages/AccountManagement';
import CapturePage from '~/pages/CapturePage';
import AdminSetting from '~/pages/AdminSetting';

// Public routes
const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.login, component: Login, layout: null },
  { path: config.routes.profile, component: Profile },
];

// Admin routes
const adminRoutes = [
  { path: config.routes.dashboard, component: Dashboard, layout: null },
  { path: config.routes.calendar, component: Calendar, layout: null },
  { path: config.routes.adminProfile, component: AdminProfile, layout: null },
  { path: config.routes.accountManagement, component: AccountManagement, layout: null },
  { path: config.routes.capture, component: CapturePage, layout: null },
  { path: config.routes.adminSetting, component: AdminSetting, layout: null },
];

export { publicRoutes, adminRoutes };
