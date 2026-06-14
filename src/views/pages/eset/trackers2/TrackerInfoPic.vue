<template>
  <div class="tracker-info-pic">
    <div ref="canvasWrap" class="tracker-info-pic__wrap">
      <div class="tracker-info-pic__actions">
        <button
          type="button"
          class="tracker-info-pic__action-btn"
          @click="openPileEntry"
        >
          <i class="el-icon-document"></i>
          桩基录入
        </button>
        <button
          type="button"
          class="tracker-info-pic__action-btn"
          :class="{ 'tracker-info-pic__action-btn--active': editMode }"
          @click="toggleEditMode"
        >
          <i :class="editMode ? 'el-icon-check' : 'el-icon-edit'"></i>
          {{ editMode ? '完成' : '编辑' }}
        </button>
      </div>
      <canvas ref="canvas" class="tracker-info-pic__canvas"></canvas>
      <div class="tracker-info-pic__overlays">
        <template v-if="editMode">
          <div
            v-for="item in postOverlays"
            :key="'post-' + item.key"
            class="tracker-info-pic__overlay"
            :style="{ left: item.x + 'px', top: item.y + 'px' }"
          >
            <select
              v-model="item.post.section"
              class="tracker-info-pic__select"
              :class="{ 'section-origin--modified': isSectionModified(item.post.section, item.post.origin_section) }"
            >
              <option
                v-for="option in postSectionOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
          <div
            v-for="item in beamOverlays"
            :key="'beam-' + item.key"
            class="tracker-info-pic__overlay"
            :style="{ left: item.x + 'px', top: item.y + 'px' }"
          >
            <select
              v-model="item.beam.section"
              class="tracker-info-pic__select tracker-info-pic__select--beam"
              :class="{ 'section-origin--modified': isSectionModified(item.beam.section, item.beam.origin_section) }"
            >
              <option
                v-for="option in getBeamSectionOptions(item.beam.origin_section, item.beam.section)"
                :key="option.value"
                :value="option.value"
              >
                {{ getBeamThicknessLabel(option.value) }}
              </option>
            </select>
          </div>
        </template>
        <template v-else>
          <el-tooltip
            v-for="item in modifiedPostOverlays"
            :key="'post-tip-' + item.key"
            :content="getOriginSectionTip(item.post.origin_section)"
            placement="top"
            :open-delay="200"
          >
            <span
              class="tracker-info-pic__section-hit tracker-info-pic__section-hit--post"
              :style="{ left: item.x + 'px', top: item.y + 'px' }"
            />
          </el-tooltip>
          <el-tooltip
            v-for="item in modifiedBeamOverlays"
            :key="'beam-tip-' + item.key"
            :content="getOriginSectionTip(item.beam.origin_section, true)"
            placement="top"
            :open-delay="200"
          >
            <span
              class="tracker-info-pic__section-hit tracker-info-pic__section-hit--beam"
              :style="{ left: item.x + 'px', top: item.y + 'px' }"
            />
          </el-tooltip>
        </template>
        <el-tooltip
          v-for="item in pileOverlays"
          :key="'pile-tip-' + item.key"
          placement="top"
          :open-delay="200"
          popper-class="tracker-info-pic__detail-tooltip"
        >
          <div slot="content">{{ getPileTooltipContent(item) }}</div>
          <span
            class="tracker-info-pic__pile-hit"
            :style="getPileHitStyle(item)"
            @dblclick.stop="handlePileDoubleClick(item.post)"
          />
        </el-tooltip>
        <el-tooltip
          v-for="item in beamHitOverlays"
          :key="item.key"
          placement="top"
          :open-delay="200"
          popper-class="tracker-info-pic__detail-tooltip"
        >
          <div slot="content">{{ getBeamTooltipContent(item) }}</div>
          <span
            class="tracker-info-pic__beam-hit"
            :style="getBeamHitStyle(item)"
          />
        </el-tooltip>
      </div>
    </div>

    <TrackerPileEntry
      ref="pileEntry"
      :visible.sync="pileEntryVisible"
      :tracker="tracker"
      :focus-post-position="pileEntryFocusPosition"
      @closed="pileEntryFocusPosition = null"
    />
  </div>
</template>

<script>
import {
  drawTrackerPostDiagram,
  computeDiagramEditOverlays,
  parseBeamThickness
} from '@/views/pages/eset/trackers2/utils/trackerPostDrawer.js'
import TrackerPileEntry from '@/views/pages/eset/trackers2/TrackerPileEntry.vue'

const POST_SECTION_OPTIONS = [
  { text: 'W6X10', value: 'W6X10' },
  { text: 'W6X11', value: 'W6X11' },
  { text: 'W6X12', value: 'W6X12' },
  { text: 'W6X15', value: 'W6X15' },
  { text: 'W6X6.2', value: 'W6X6.2' },
  { text: 'W6X7', value: 'W6X7' },
  { text: 'W6X8', value: 'W6X8' },
  { text: 'W6X8.5', value: 'W6X8.5' },
  { text: 'W6X9', value: 'W6X9' },
  { text: 'W8X10', value: 'W8X10' },
  { text: 'W8X13', value: 'W8X13' },
  { text: 'W8X15', value: 'W8X15' },
  { text: 'W8X18', value: 'W8X18' },
  { text: 'W8X21', value: 'W8X21' },
  { text: 'W8X24', value: 'W8X24' },
  { text: 'W8X8', value: 'W8X8' }
]

export default {
  name: 'TrackerInfoPic',

  components: {
    TrackerPileEntry
  },

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
      resizeObserver: null,
      editMode: false,
      pileEntryVisible: false,
      pileEntryFocusPosition: null,
      postOverlays: [],
      beamOverlays: [],
      pileOverlays: [],
      beamHitOverlays: []
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
    },

    postSectionOptions() {
      return POST_SECTION_OPTIONS
    },

    modifiedPostOverlays() {
      return this.postOverlays.filter((item) =>
        this.isSectionModified(item.post.section, item.post.origin_section)
      )
    },

    modifiedBeamOverlays() {
      return this.beamOverlays.filter((item) =>
        this.isSectionModified(item.beam.section, item.beam.origin_section)
      )
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
    },

    editMode() {
      this.refreshOverlayLayout()
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
    toggleEditMode() {
      if (!this.editMode) {
        this.normalizeTrackerSections()
      }
      this.editMode = !this.editMode
    },

    getOriginSectionTip(originSection, isBeam) {
      if (!originSection) {
        return '原始截面：—'
      }
      const label = isBeam
        ? (this.getBeamThicknessLabel(originSection) || originSection)
        : originSection
      return `原始截面：${label}`
    },

    getPileHitStyle(item) {
      const text = item.text || ''
      const width = Math.max(24, Math.min(72, text.length * 7 + 6))
      return {
        left: item.x + 'px',
        top: item.y + 'px',
        width: width + 'px'
      }
    },

    getPileTooltipContent(item) {
      const hint = '双击可修改/double click to modify'
      const desc = item.post && item.post.pile_desc
      if (desc != null && String(desc).trim() !== '') {
        return `${hint}\n${String(desc).trim()}`
      }
      return hint
    },

    getBeamHitStyle(item) {
      return {
        left: item.left + 'px',
        top: item.top + 'px',
        width: item.width + 'px',
        height: item.height + 'px'
      }
    },

    getBeamTooltipContent(item) {
      const beam = item && item.beam
      if (!beam) {
        return ''
      }

      const lines = [
        `原始截面：${beam.origin_section || '—'}`,
        `当前截面：${beam.section || '—'}`,
        `材质：${beam.material || '—'}`,
        `起点：${this.formatBeamPosition(beam.start)}`,
        `终点：${this.formatBeamPosition(beam.end)}`,
        `长度：${this.formatBeamLength(beam)}`
      ]

      const ratio = beam.ratio
      if (ratio != null && ratio !== '' && Number(ratio) > 0) {
        lines.push(`应力比：${Number(ratio).toFixed(2)}`)
      }

      return lines.join('\n')
    },

    formatBeamPosition(value) {
      if (value == null || value === '') {
        return '—'
      }
      const num = Number(value)
      return Number.isNaN(num) ? String(value) : String(Math.round(num))
    },

    formatBeamLength(beam) {
      if (beam.length != null && beam.length !== '') {
        const length = Number(beam.length)
        if (!Number.isNaN(length)) {
          return String(Math.round(length))
        }
      }
      if (beam.start != null && beam.end != null) {
        const length = Number(beam.end) - Number(beam.start)
        if (!Number.isNaN(length)) {
          return String(Math.round(length))
        }
      }
      return '—'
    },

    handlePileDoubleClick(post) {
      if (!post) {
        return
      }
      this.pileEntryFocusPosition = post.position
      this.pileEntryVisible = true
    },

    openPileEntry() {
      this.pileEntryFocusPosition = null
      this.pileEntryVisible = true
    },

    isPostOriginSectionValid(originSection) {
      if (originSection === undefined || originSection === null || String(originSection).trim() === '') {
        return false
      }
      return /\d/.test(String(originSection))
    },

    isBeamOriginSectionValid(originSection) {
      if (!originSection) return false
      return /^(.*x)(\d+(?:\.\d+)?)$/i.test(String(originSection).trim())
    },

    normalizeSectionOrigin(item, kind) {
      if (!item || !item.section) return
      const valid = kind === 'beam'
        ? this.isBeamOriginSectionValid(item.origin_section)
        : this.isPostOriginSectionValid(item.origin_section)
      if (!valid) {
        item.origin_section = item.section
      }
    },

    normalizeTrackerSections() {
      ;(this.postList || []).forEach((p) => this.normalizeSectionOrigin(p, 'post'))
      ;(this.beamList || []).forEach((b) => this.normalizeSectionOrigin(b, 'beam'))
    },

    isSectionModified(section, originSection) {
      if (!section || !originSection) return false
      return String(section) !== String(originSection)
    },

    getBeamThicknessLabel(section) {
      return parseBeamThickness(section) || section
    },

    /** 主梁截面：以 origin_section 末尾数值为基准，±0.5 步进 0.1 */
    getBeamSectionOptions(originSection, currentSection) {
      const deltas = [-0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5]
      const fallback = currentSection || originSection
      if (!originSection) {
        return fallback ? [{ text: fallback, value: fallback }] : []
      }
      const match = String(originSection).match(/^(.*x)(\d+(?:\.\d+)?)$/i)
      if (!match) {
        return [{ text: originSection, value: originSection }]
      }
      const prefix = match[1]
      const base = parseFloat(match[2])
      const options = deltas.map((delta) => {
        const num = Math.round((base + delta) * 10) / 10
        const value = prefix + num.toFixed(1)
        return { text: value, value }
      })
      if (currentSection && !options.some((o) => o.value === currentSection)) {
        options.push({ text: currentSection, value: currentSection })
      }
      return options
    },

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

    getDrawOptions() {
      return {
        horizontalScale: this.horizontalScale,
        verticalScale: this.verticalScale,
        beamList: this.beamList,
        beamInfoLst1: this.beamInfoLst1,
        beamSectionType: this.tracker.beam_section_type,
        beamSectionDim: this.tracker.beam_section_dim,
        beamLength: this.tracker.beam_length
      }
    },

    refreshOverlayLayout() {
      const canvas = this.$refs.canvas
      if (!canvas) {
        return
      }

      const rect = canvas.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) {
        return
      }

      const { postOverlays, beamOverlays, pileOverlays, beamHitOverlays } = computeDiagramEditOverlays(
        rect.width,
        this.postList,
        this.getDrawOptions()
      )
      this.postOverlays = postOverlays
      this.beamOverlays = beamOverlays
      this.pileOverlays = pileOverlays
      this.beamHitOverlays = beamHitOverlays
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

      drawTrackerPostDiagram(ctx, rect.width, rect.height, this.postList, this.getDrawOptions())
      this.refreshOverlayLayout()
    }
  }
}
</script>

<style scoped>
.tracker-info-pic {
  width: 100%;
}

.tracker-info-pic__wrap {
  position: relative;
  width: 100%;
}

.tracker-info-pic__actions {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tracker-info-pic__action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid rgba(94, 196, 188, 0.45);
  border-radius: 4px;
  background: rgba(20, 30, 46, 0.88);
  color: #5ec4bc;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.tracker-info-pic__action-btn:hover {
  background: rgba(30, 44, 64, 0.95);
  border-color: rgba(94, 196, 188, 0.7);
}

.tracker-info-pic__action-btn--active {
  color: #5adb8f;
  border-color: rgba(90, 219, 143, 0.55);
}

.tracker-info-pic__canvas {
  display: block;
  width: 100%;
  max-width: 100%;
  height: 220px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}

.tracker-info-pic__overlays {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.tracker-info-pic__overlay {
  position: absolute;
  transform: translate(-50%, -2px);
  pointer-events: auto;
}

.tracker-info-pic__select {
  width: 88px;
  padding: 1px 2px;
  border: 1px solid rgba(94, 196, 188, 0.55);
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.96);
  color: #303133;
  font-size: 11px;
  line-height: 1.4;
  text-align: center;
  cursor: pointer;
}

.tracker-info-pic__select--beam {
  width: 48px;
}

.tracker-info-pic__select.section-origin--modified {
  color: #f56c6c;
  border-color: #f56c6c;
  font-weight: 600;
}

.tracker-info-pic__section-hit {
  position: absolute;
  display: inline-block;
  transform: translate(-50%, -2px);
  pointer-events: auto;
  cursor: help;
  background: transparent;
}

.tracker-info-pic__section-hit--post {
  min-width: 72px;
  height: 14px;
}

.tracker-info-pic__section-hit--beam {
  min-width: 36px;
  height: 14px;
}

.tracker-info-pic__pile-hit {
  position: absolute;
  display: inline-block;
  height: 14px;
  transform: translate(0, -50%);
  pointer-events: auto;
  cursor: pointer;
  background: transparent;
}

.tracker-info-pic__beam-hit {
  position: absolute;
  pointer-events: auto;
  cursor: help;
  background: transparent;
}
</style>

<style>
.tracker-info-pic__detail-tooltip {
  max-width: 360px;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
}
</style>
