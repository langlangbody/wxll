 /**
 * @author xll
 * @template Xteam
 * time
*/

<template>
  <div class="index-flash__content">
      <index-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import IndexView from '@/components/index-view/container.vue'

export default {
  name: 'app-container',
  components: {
    'index-view': IndexView
  }
}
</script>