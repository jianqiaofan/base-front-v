<template>
  <div class="dashboard-container">
    <Daping></Daping>

  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Daping from '../pages/daping/dp.vue'


export default {
  name: 'Dashboard',
  components: {Daping},
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
