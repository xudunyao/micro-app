
import type { RouteRecordRaw } from 'vue-router';
const dashboardRoute: RouteRecordRaw = {
  path: '/home',
  name: 'Home',
  component: () => import('./index.vue'),
  meta: {
    title: '首页',
    path: '/home',
    key: 'menu-home',
    permissionKey: 'menu-home',
    icon: '',
    link: '/home',
  },
};

export default dashboardRoute;