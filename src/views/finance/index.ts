
import type { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
const RouterViewOnly = { render: () => h(resolveComponent('RouterView')) };
const Transaction = () => import('@views/finance/transaction/index.vue');
const Withdraw = () => import('@views/finance/withdraw/index.vue');

const financeRoute: RouteRecordRaw = {
  path: '/finance',
  name: 'Finance',
  redirect: '/finance/transaction', 
  component: RouterViewOnly, 
  meta: {
    title: '财务报表',
    key: 'menu-finance',
    permissionKey: 'menu-finance',
    icon: '',
    link: '/finance',
  },
  children: [
    {
      path: 'transaction',
      name: 'FinanceTransaction',
      component: Transaction,
      meta: {
        title: '交易记录',
        key: 'menu-finance_trade',
        permissionKey: 'menu-finance_trade',
        link: '/finance/transaction',
      },
    },
    {
      path: 'withdraw',
      name: 'FinanceWithdraw',
      component: Withdraw,
      meta: {
        title: '提现记录',
        key: 'menu-finance_withdraw',
        permissionKey: 'menu-finance_withdraw',
        allowAccess: true,
        link: '/finance/withdraw',
      },
    },
  ],
};
export default financeRoute;