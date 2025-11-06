import type { RouteRecordRaw } from 'vue-router';

// 自动扫描 views/**/index.ts 路由模块
const modules = import.meta.glob('../views/**/index.ts', { eager: true });
// 提取默认导出的路由对象
const dynamic: RouteRecordRaw[] = Object.values(modules).map((mod: any) => mod.default);


export default dynamic;

