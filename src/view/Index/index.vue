 /**
 * @author xii
 * @template Index
 * 2019/01/22,07:20:41 pm
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