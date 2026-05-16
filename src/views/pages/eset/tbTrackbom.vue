<template>
  <div id="app-container">
    <TrackerIndex/>
  </div>
</template>

<script>

import TrackerIndex from '@/views/pages/eset/trackers2/TrackerIndex.vue'

export default {
  name: 'tbTrackbom',
  components: {
    TrackerIndex
  }
}
</script>

<style scoped>
#app-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  max-width: 100%; /* 限制容器宽度不超过屏幕宽度 */
  overflow-x: auto; /* 当内容宽度超过容器宽度时显示水平滚动条 */
}

</style>
