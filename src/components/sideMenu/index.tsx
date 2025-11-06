import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { VNode } from 'vue'
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'

interface MenuItem {
  title?: string
  key: string
  icon?: VNode
  link?: string
  visible?: boolean
  children?: MenuItem[]
}

interface Props {
  menus?: MenuItem[]
  selectedKeys?: string[]
  defaultOpenKeys?: string[]
}

export default defineComponent({
  name: 'SideMenu',
  props: {
    menus: {
      type: Array as () => MenuItem[],
      default: () => [],
    },
    selectedKeys: {
      type: Array as () => string[],
      default: () => [],
    },
    defaultOpenKeys: {
      type: Array as () => string[],
      default: () => [],
    },
  },
  setup(props: Props) {
    const router = useRouter()
    // 当前展开的菜单 key
    const openKeys = ref<string[]>(props.defaultOpenKeys || [])
    watch(
      () => props.defaultOpenKeys,
      (newKeys) => {
        openKeys.value = newKeys || []
      },
      { immediate: true }
    )
    const rootSubmenuKeys = props.menus?.map(({ key }) => key) || []
    const handleOpen = (index: string, indexPath: string[]) => {
      const latestOpenKey = indexPath.find(
        (key) => !openKeys.value.includes(key)
      )
      if (rootSubmenuKeys.includes(latestOpenKey || '')) {
        openKeys.value = latestOpenKey ? [latestOpenKey] : []
      } else {
        openKeys.value = [...indexPath]
      }
    }
    const handleClose = (index: string, indexPath: string[]) => {
      openKeys.value = openKeys.value.filter((k) => k !== index)
    }
    // 菜单选中时的逻辑
    const handleSelect = (index: string) => {
      const menu = findMenuByKey(props.menus || [], index)
      if (menu) handleMenuClick(menu)
    }
    const findMenuByKey = (menus: MenuItem[], key: string): MenuItem | null => {
      for (const menu of menus) {
        if (menu.key === key) return menu
        if (menu.children) {
          const found = findMenuByKey(menu.children, key)
          if (found) return found
        }
      }
      return null
    }
    const handleMenuClick = (menu: MenuItem) => {
      if (menu.link) {
        router.push({ path: menu.link, state: { title: menu.title } })
      }
    }
    const renderSubMenu = (list: MenuItem[]): VNode[] => {
      return list
        .filter((menu) => menu.visible !== false)
        .map((menu) => {
          const hasVisibleChildren =
            menu.children &&
            menu.children.length &&
            menu.children.some((m) => m.visible !== false)
          if (hasVisibleChildren) {
            return (
              <ElSubMenu key={menu.key ?? ''} index={menu.key ?? ''}>
                {{
                  title: () => (
                    <span>
                      {menu.icon}
                      <span style="margin-left: 8px;">{menu.title}</span>
                    </span>
                  ),
                  default: () => renderSubMenu(menu.children || []),
                }}
              </ElSubMenu>
            )
          }
          return (
            <ElMenuItem key={menu.key ?? ''} index={menu.key ?? ''}>
              {menu.icon}
              <span style="margin-left: 8px;">{menu.title}</span>
            </ElMenuItem>
          )
        })
    }
    return () => (
      <ElMenu
        defaultOpeneds={openKeys.value}
        defaultActive={props.selectedKeys?.[0] || ''}
        onOpen={handleOpen}
        onClose={handleClose}
        onSelect={handleSelect}
      >
        {renderSubMenu(props.menus || [])}
      </ElMenu>
    )
  },
})
