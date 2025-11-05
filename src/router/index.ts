import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 自动扫描 views/**/index.ts 路由模块
const modules = import.meta.glob('../views/**/index.ts', { eager: true })

// 提取默认导出的路由对象
const routes: RouteRecordRaw[] = Object.values(modules).map((mod: any) => mod.default)

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 全局路由守卫
router.beforeEach((to, _from, next) => {
  document.title = (to.meta?.title as string) || 'Micro App'
  next()
})

export default router

