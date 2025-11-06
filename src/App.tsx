import { defineComponent, Suspense } from 'vue';
import { RouterView } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <Suspense>
        {{
          default: () => <RouterView />,
          fallback: () => <div>Loading...</div>,
        }}
      </Suspense>
    );
  },
});
