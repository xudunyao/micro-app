import { defineComponent } from 'vue'
import { ElHeader } from 'element-plus'
import styles from './styles.module.less'

export default defineComponent({
  name: 'Header',
  setup() {
    return () => (
      <ElHeader class={styles.header}>
        header
      </ElHeader>
    )
  },
})
