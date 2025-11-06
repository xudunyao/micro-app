import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { ElContainer, ElMain } from 'element-plus'
import Header from './header'
import Sider from './sider'
import BreadCrumb from './breadcrumb'
import styles from './styles.module.less'

export default defineComponent({
  name: 'DefaultLayout',
  setup() {
    return () => (
      <ElContainer class={styles.layout}>
        <Header />
        <ElContainer>
          <Sider class={styles.sider} />
          <ElMain class={styles.content}>
            <BreadCrumb />
            <RouterView />
          </ElMain>
        </ElContainer>
      </ElContainer>
    )
  },
})
