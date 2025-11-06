
/**
 * 菜单项类型
 * 表示最终生成的可展示菜单数据结构
 */
interface MenuItem {
  key?: string // 唯一标识（例如 'dashboard'）
  link?: string // 路由路径（例如 '/dashboard'）
  permissionKey?: string // 权限标识（例如 'USER_VIEW'）
  allowAccess?: boolean // 是否显式允许访问（绕过权限）
  displayInMenu?: boolean // 是否显示在菜单中（false 则隐藏）
  visible?: boolean // 实际是否可见（内部计算字段）
  title?: string // 菜单显示名称
  children?: MenuItem[] // 子菜单（树状结构）
}

/**
 * 路由配置中的自定义字段
 * 通常挂载在每个路由的 meta 或 options 上
 */
interface RouteOption {
  key?: string // 路由唯一 key
  link?: string // 路由路径
  permissionKey?: string // 权限标识
  allowAccess?: boolean // 是否显式允许访问
  displayInMenu?: boolean // 是否在菜单中显示
}

/**
 * 路由类型
 * 一个标准的树状路由结构
 */
interface Route {
  meta?: RouteOption // 当前路由的自定义配置项
  children?: Route[] // 子路由
}

/**
 * 返回结果类型
 * 包含菜单树和当前激活菜单 key
 */
interface MenuResult {
  menus: MenuItem[] // 生成的菜单树
  currentMenuKeys: string[] // 当前激活的菜单 key（用于菜单高亮）
}
/**
 * 从路由配置中提取可展示的菜单结构
 * 同时根据权限控制菜单显示，并标记当前激活菜单
 *
 * @param routes - 路由配置数组
 * @param permissions - 当前用户的权限列表
 * @param isAdmin - 是否为管理员（管理员跳过权限校验）
 * @param path - 当前访问的路径（用于确定当前激活菜单）
 */
export const getMenusFromRoutes = (
  routes: Route[],
  permissions: string[],
  isAdmin: boolean,
  path = ''
): MenuResult => {
  // 存放最终生成的菜单结构
  const menus: MenuItem[] = []
  // 当前激活的菜单 key 数组（例如 ['dashboard', 'user']）
  let currentMenuKeys: string[] = []
  // 遍历所有路由节点
  routes.forEach((route) => {
    console.log('=================routes===================',route)
    const options = route.meta
    const children = route.children
    // 没有 key 的路由不参与菜单生成
    if (!options?.key) return
    //  如果当前路由的 link 匹配 path，则说明该菜单被激活
    if (
      options?.link === path ||
      (options?.link !== '/' && path.indexOf(options?.link || '') === 0)
    ) {
      currentMenuKeys.push(options.key)
    }
    // 满足以下任一条件即可显示菜单：
    // - 没有配置 permissionKey（说明无需权限）
    // - 显式允许访问 (allowAccess)
    // - 用户拥有此权限
    // - 当前用户是管理员
    const hasAccess =
      !options.permissionKey ||
      options.allowAccess ||
      permissions?.includes(options.permissionKey) ||
      isAdmin
    if (hasAccess) {
      const menu: MenuItem = {
        ...options,
        // displayInMenu 为 false 时隐藏菜单
        visible: options.displayInMenu !== false,
      }
      // 如果有子路由，则递归处理
      if (children?.length) {
        const childRes = getMenusFromRoutes(
          children,
          permissions,
          isAdmin,
          path
        )
        menu.children = childRes.menus
        //合并子菜单中的当前激活菜单 key
        currentMenuKeys = currentMenuKeys.concat(childRes.currentMenuKeys || [])
      }
      menus.push(menu)
    }
  })
  //返回完整菜单结构与当前激活菜单 key
  return { menus, currentMenuKeys }
}
export default {}
