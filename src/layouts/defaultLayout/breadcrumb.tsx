import { defineComponent, computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import appRoutes from '@/routes/appRoutes';
import { getMenusFromRoutes } from './utils.ts';
import styles from './styles.module.less';

export default defineComponent({
  name: 'BreadCrumb',
  setup() {
    const route = useRoute();
    const staticPath = computed(() => {
      let path = route.path;
      const routeParams = route.params;
      if (routeParams) {
        Object.keys(routeParams).forEach((key) => {
          path = path.replace(routeParams[key] as string, `:${key}`);
        });
      }
      return path;
    });
    const menuData = computed(() => {
      return getMenusFromRoutes(
        appRoutes || [],
        staticPath.value,
      );
    });
    const currentMenu = computed(() => {
      return menuData.value.menus.find(
        ({ key  }) => key === menuData.value.currentMenuKeys[0]
      );
    });
    const getRoutes = (menuList: any[] = [], depth = 0): any[] => {
      const routes: any[] = [];
      menuList.forEach((menu) => {
        if (menu?.visible !== false) {
          routes.push({
            path: menu?.link?.split('/')[depth + 1],
            breadcrumbName: menu?.title,
            link: menu?.link,
            children: menu?.children?.length ? getRoutes(menu.children, depth + 1) : [],
          });
        }
      });
      return routes;
    };
    const routes = computed(() => {
      const baseRoutes = getRoutes([currentMenu.value]) || [];
      if (
        staticPath.value !== '/not-authorized' &&
        route.path !== currentMenu.value?.link
      ) {
        baseRoutes.push({
          path: route.path,
          link: route.path,
        });
      }
      return baseRoutes;
    });

    const flattenRoutes = (routes: any[]): any[] => {
      const result: any[] = [];
      routes.forEach((route) => {
        if (route.children && route.children.length > 0) {
          result.push(...flattenRoutes(route.children));
        } else {
          result.push(route);
        }
      });
      return result;
    };

    const breadcrumbItems = computed(() => {
      return flattenRoutes(routes.value);
    });

    return () => (
      <div class={styles.breadcrumb} >
        {breadcrumbItems.value.map((item, index) => {
          const isLast = index === breadcrumbItems.value.length - 1;
          return (
            <div key={index}>
              {isLast ? (
                <span>{item.breadcrumbName}</span>
              ) : (
                <RouterLink to={item.link || '#'}>{item.breadcrumbName}</RouterLink>
              )}
            </div>
          );
        })}
      </div>
    );
  },
});

