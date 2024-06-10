const routes = {
  //header
  home: '/',
  login: '/login',
  profile: '/profile',

  //adminRoutes
  dashboard: '/admin/dashboard',
  calendar: '/admin/calendar',
  adminProfile: '/admin/profile',
  accountManagement: '/admin/account/management',
  capture: '/admin/account/:user_id/capture',
  adminSetting: '/admin/setting',
};

export default routes;
