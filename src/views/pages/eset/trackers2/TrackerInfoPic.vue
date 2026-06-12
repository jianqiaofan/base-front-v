<template>
  <div class="tracker-info-pic">
    <canvas ref="canvas" class="tracker-info-pic__canvas"></canvas>
  </div>
</template>

<script>
import { drawTrackerPostDiagram } from '@/views/pages/eset/trackers2/utils/trackerPostDrawer.js'

export default {
  name: 'TrackerInfoPic',

  props: {
    tracker: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      horizontalScale: 1,
      verticalScale: 1,
      resizeObserver: null
    }
  },

  computed: {
    postList() {
      return this.tracker.post_info_lst || []
    },

    beamList() {
      return this.tracker.beam_info_lst || []
    },

    beamInfoLst1() {
      return this.tracker.beam_info_lst_1
    }
  },

  watch: {
    postList: {
      deep: true,
      handler() {
        this.draw()
      }
    },

    beamList: {
      deep: true,
      handler() {
        this.draw()
      }
    },

    beamInfoLst1: {
      deep: true,
      handler() {
        this.draw()
      }
    },

    'tracker.beam_section_type'() {
      this.draw()
    },

    'tracker.beam_section_dim'() {
      this.draw()
    },

    'tracker.beam_length'() {
      this.draw()
    },

    horizontalScale() {
      this.draw()
    },

    verticalScale() {
      this.draw()
    }
  },

  mounted() {
    this.initCanvas()
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.draw)
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  },

  methods: {
    initCanvas() {
      this.$nextTick(() => {
        const canvas = this.$refs.canvas
        if (!canvas || !canvas.parentElement) {
          return
        }

        this.draw()

        if (typeof ResizeObserver !== 'undefined') {
          this.resizeObserver = new ResizeObserver(() => {
            this.draw()
          })
          this.resizeObserver.observe(canvas.parentElement)
        } else {
          window.addEventListener('resize', this.draw)
        }
      })
    },

    draw() {
      const canvas = this.$refs.canvas
      if (!canvas) {
        return
      }

      const rect = canvas.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) {
        return
      }

      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)

      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      drawTrackerPostDiagram(ctx, rect.width, rect.height, this.postList, {
        horizontalScale: this.horizontalScale,
        verticalScale: this.verticalScale,
        beamList: this.beamList,
        beamInfoLst1: this.beamInfoLst1,
        beamSectionType: this.tracker.beam_section_type,
        beamSectionDim: this.tracker.beam_section_dim,
        beamLength: this.tracker.beam_length
      })
    }
  }
}
</script>

<style scoped>
.tracker-info-pic {
  width: 100%;
}

.tracker-info-pic__canvas {
  display: block;
  width: 100%;
  max-width: 100%;
  height: 220px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}
</style>
