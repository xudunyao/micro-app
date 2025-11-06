import { defineComponent, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElAside, ElButton, ElMenu } from 'element-plus'
import { Menu as MenuIcon } from '@element-plus/icons-vue'
import { SideMenu } from '@/components/index'
import appRoutes from '@/routes/appRoutes'
import { getMenusFromRoutes } from './utils'
import styles from './styles.module.less'

const MENU_COLLAPSED_KEY = 'menu-collapsed'

export default defineComponent({
  name: 'Sider',
  setup() {
    const route = useRoute()
    // 菜单折叠状态
    const collapsed = ref(localStorage.getItem(MENU_COLLAPSED_KEY) === 'true')
    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value
      localStorage.setItem(MENU_COLLAPSED_KEY, String(collapsed.value))
    }
    // 计算当前路由对应的静态路径
    const staticPath = computed(() => {
      let path = route.path
      const params = route.params
      if (params) {
        Object.keys(params).forEach((key) => {
          path = path.replace(params[key] as string, `:${key}`)
        })
      }
      return path
    })

    // 根据路由生成菜单数据
    const menuData = computed(() => {
      return getMenusFromRoutes(appRoutes || [], [], true, staticPath.value)
    })
    // 当前选中菜单和展开菜单
    const activeKeys = ref(menuData.value.currentMenuKeys[0] || '')
    const openKeys = ref(menuData.value.currentMenuKeys)
    // 监听 menuData 更新
    watch(
      () => menuData.value.currentMenuKeys,
      (keys) => {
        activeKeys.value = keys[0] || ''
        openKeys.value = keys
      },
      { immediate: true }
    )

    // 监听路由变化，自动高亮和展开菜单
    watch(
      () => route.fullPath,
      () => {
        const keys = menuData.value.currentMenuKeys
        activeKeys.value = keys[0] || ''
        openKeys.value = keys
      }
    )

    return () => (
      <ElAside width={collapsed.value ? '64px' : '200px'} class={styles.sider}>
        <div class={styles.menu}>
          <SideMenu
            menus={menuData.value.menus}
            selectedKeys={[activeKeys.value]}
            defaultOpenKeys={openKeys.value}
          />
        </div>
        <ElButton
          text
          onClick={toggleCollapsed}
          class={styles.menuCollapsedButton}
          style={{ marginBottom: '16px' }}
        >
          <MenuIcon />
        </ElButton>
      </ElAside>
    )
  },
})
