import { createRouter, createWebHistory } from 'vue-router';
import { DefaultLayout } from '@layouts';
import dynamic from './appRoutes'; 

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: dynamic,
  },
  {
    path: '/not-authorized',
    name: 'NotAuthorized',
    component: () => import('@modules/error/index.tsx'),
  },
];
// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
});
// 全局路由守卫
router.beforeEach((to, _from, next) => {
  document.title = (to.meta?.title as string) || 'Micro App';
  next();
});
export { routes };  
export default router; 
