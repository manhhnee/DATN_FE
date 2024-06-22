const routes = {
  //header
  home: '/home',
  login: '/login',
  profile: '/profile',
  history: '/history',
  report: '/report',

  //adminRoutes
  dashboard: '/admin/dashboard',
  calendar: '/admin/calendar',
  adminProfile: '/admin/profile',
  accountManagement: '/admin/account/management',
  holidayManagement: '/admin/holiday/management',
  capture: '/admin/account/:user_id/capture',
  adminSetting: '/admin/setting',
};

export default routes;
