
import type { RouteRecordRaw } from 'vue-router';
const dashboardRoute: RouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('./index.vue'),
  meta: {
    title: '仪表盘',
    path: '/dashboard',
    key: 'menu-dashboard',
    permissionKey: 'menu-dashboard',
    icon: '',
    link: '/dashboard',
  },
};

export default dashboardRoute;