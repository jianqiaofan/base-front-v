<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="920px"
    append-to-body
    custom-class="tracker-pile-entry-dialog"
    :close-on-click-modal="false"
    :before-close="handleBeforeClose"
    @open="handleDialogOpen"
    @opened="handleDialogOpened"
    @closed="handleMainClosed"
  >
    <div slot="title" class="pile-entry__header">
      <i class="el-icon-s-grid pile-entry__header-icon"></i>
      <span class="pile-entry__header-title">{{ headerTitle }}</span>
    </div>
    <div class="pile-entry" :class="{ 'pile-entry--single': isSinglePostMode }">
      <div v-if="!isSinglePostMode" class="pile-entry__toolbar">
        <span class="pile-entry__toolbar-label">批量设置桩型</span>
        <el-select
          v-model="batchPileType"
          size="small"
          class="pile-entry__batch-select"
          placeholder="选择桩型"
          @change="openBatchPileEdit"
        >
          <el-option
            v-for="opt in pileTypeOptions"
            :key="opt.value"
            :label="opt.text"
            :value="opt.value"
          />
        </el-select>
        <span class="pile-entry__toolbar-hint">选择后将打开参数编辑，确认后应用到全部立柱</span>
        <el-button
          size="small"
          icon="el-icon-refresh-left"
          :disabled="!isDirty"
          @click="revertChanges"
        >
          撤销修改
        </el-button>
      </div>

      <div class="pile-entry__body">
        <el-table
          :data="visibleDraftPosts"
          size="small"
          border
          stripe
          class="pile-entry__table"
        >
          <el-table-column label="桩号" width="72" align="center">
          <template slot-scope="{ row }">
            {{ formatPostNo(row) }}
          </template>
        </el-table-column>
        <el-table-column label="位置" width="72" align="center">
          <template slot-scope="{ row }">
            {{ formatPosition(row.position) }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="驱动" width="72" align="center" />
        <el-table-column label="基础类型" width="132" align="center">
          <template slot-scope="{ row }">
            <el-select
              v-model="row.pile_type"
              size="mini"
              @change="(val) => openPostPileEdit(row, val)"
            >
              <el-option
                v-for="opt in pileTypeOptions"
                :key="opt.value"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="基础详情" min-width="240">
          <template slot-scope="{ row }">
            <span class="pile-entry__desc">{{ row.pile_desc || '—' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="72" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="openPostPileEdit(row, row.pile_type)">
              编辑
            </el-button>
          </template>
        </el-table-column>
        </el-table>
      </div>
    </div>

    <span slot="footer" class="pile-entry__footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" :disabled="!isDirty" @click="confirmChanges">确认修改</el-button>
    </span>

    <el-dialog
      title="编辑桩参数"
      :visible.sync="pileEditVisible"
      width="740px"
      append-to-body
      :close-on-click-modal="false"
      :modal="false"
      @closed="handlePileEditClosed"
    >
      <PileType0
        v-if="currentPileType === 0"
        :key="pileFormKey"
        :receive="onPileReceive"
        :scope="currentScope"
        :initial-data="currentInitialData"
      />
      <PileType1
        v-if="currentPileType === 1"
        :key="pileFormKey"
        :receive="onPileReceive"
        :scope="currentScope"
        :initial-data="currentInitialData"
      />
      <PileType2
        v-if="currentPileType === 2"
        :key="pileFormKey"
        :receive="onPileReceive"
        :scope="currentScope"
        :initial-data="currentInitialData"
      />
      <PileType3
        v-if="currentPileType === 3"
        :key="pileFormKey"
        :receive="onPileReceive"
        :scope="currentScope"
        :initial-data="currentInitialData"
      />
    </el-dialog>
  </el-dialog>
</template>

<script>
import PileType0 from '@/views/pages/eset/trackers2/PileType0.vue'
import PileType1 from '@/views/pages/eset/trackers2/PileType1.vue'
import PileType2 from '@/views/pages/eset/trackers2/PileType2.vue'
import PileType3 from '@/views/pages/eset/trackers2/PileType3.vue'
import {
  bindDialogDrag,
  findDialogByClass,
  resetDialogPosition
} from '@/views/pages/eset/trackers2/utils/dialogDrag.js'

const PILE_TYPE_OPTIONS = [
  { text: '桩柱一体', value: 0 },
  { text: '地脚螺栓', value: 1 },
  { text: 'PHC管桩', value: 2 },
  { text: '钢桩', value: 3 }
]

function deepClone(value) {
  if (value == null) {
    return value
  }
  return JSON.parse(JSON.stringify(value))
}

function capturePileSnapshot(tracker) {
  return {
    tracker: {
      pile_type: tracker.pile_type,
      pile_obj: deepClone(tracker.pile_obj),
      pile_desc: tracker.pile_desc,
      pile_depth: tracker.pile_depth
    },
    posts: (tracker.post_info_lst || []).map((post) => ({
      position: post.position,
      no: post.no,
      category: post.category,
      pile_type: post.pile_type,
      pile_obj: deepClone(post.pile_obj),
      pile_desc: post.pile_desc,
      pile_depth: post.pile_depth
    }))
  }
}

export default {
  name: 'TrackerPileEntry',

  components: {
    PileType0,
    PileType1,
    PileType2,
    PileType3
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tracker: {
      type: Object,
      required: true
    },
    focusPostPosition: {
      type: [String, Number],
      default: null
    }
  },

  data() {
    return {
      initialSnapshot: null,
      draftPosts: [],
      draftTrackerPile: null,
      pileEditVisible: false,
      batchPileType: null,
      batchMode: false,
      currentPost: null,
      prePileType: 2,
      currentPileType: 2,
      currentScope: '',
      currentInitialData: null,
      pileFormKey: 0,
      unbindDialogDrag: null
    }
  },

  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },

    pileTypeOptions() {
      return PILE_TYPE_OPTIONS
    },

    isSinglePostMode() {
      return this.focusPostPosition != null && this.focusPostPosition !== ''
    },

    visibleDraftPosts() {
      if (!this.isSinglePostMode) {
        return this.draftPosts
      }
      return this.draftPosts.filter(
        (post) => String(post.position) === String(this.focusPostPosition)
      )
    },

    headerTitle() {
      if (!this.isSinglePostMode) {
        return '桩基录入'
      }
      const post = this.visibleDraftPosts[0]
      if (!post) {
        return '桩基录入'
      }
      const postNo = this.formatPostNo(post)
      if (postNo !== '—') {
        return `桩基录入 - ${postNo}`
      }
      return `桩基录入 - 位置${this.formatPosition(post.position)}`
    },

    isDirty() {
      if (!this.initialSnapshot) {
        return false
      }
      if (this.isSinglePostMode) {
        const draft = this.getFocusedDraftPost()
        const initial = this.getFocusedInitialPost()
        if (!draft || !initial) {
          return false
        }
        return JSON.stringify(draft) !== JSON.stringify(initial)
      }
      return JSON.stringify(this.getDraftState()) !== JSON.stringify(this.initialSnapshot)
    }
  },

  beforeDestroy() {
    this.teardownDialogDrag()
  },

  methods: {
    getDraftState() {
      return {
        tracker: this.draftTrackerPile,
        posts: this.draftPosts
      }
    },

    loadDraftFromSnapshot(snapshot) {
      this.initialSnapshot = deepClone(snapshot)
      this.draftPosts = deepClone(snapshot.posts)
      this.draftTrackerPile = deepClone(snapshot.tracker)
    },

    handleDialogOpen() {
      this.loadDraftFromSnapshot(capturePileSnapshot(this.tracker))
      this.batchPileType = null
    },

    handleDialogOpened() {
      this.$nextTick(() => {
        this.teardownDialogDrag()
        const dragDom = findDialogByClass('tracker-pile-entry-dialog')
        this.unbindDialogDrag = bindDialogDrag(dragDom)
      })
    },

    getFocusedDraftPost() {
      if (!this.isSinglePostMode) {
        return null
      }
      return this.draftPosts.find(
        (post) => String(post.position) === String(this.focusPostPosition)
      )
    },

    getFocusedInitialPost() {
      if (!this.initialSnapshot || !this.isSinglePostMode) {
        return null
      }
      return this.initialSnapshot.posts.find(
        (post) => String(post.position) === String(this.focusPostPosition)
      )
    },

    editPostByPosition(position) {
      const post = this.draftPosts.find((item) => String(item.position) === String(position))
      if (!post) {
        return false
      }
      this.openPostPileEdit(post, post.pile_type)
      return true
    },

    teardownDialogDrag() {
      if (this.unbindDialogDrag) {
        this.unbindDialogDrag()
        this.unbindDialogDrag = null
      }
      resetDialogPosition(findDialogByClass('tracker-pile-entry-dialog'))
    },

    formatPostNo(row) {
      if (row.no != null && String(row.no).trim() !== '') {
        return String(row.no)
      }
      return '—'
    },

    formatPosition(value) {
      if (value == null || value === '') {
        return ''
      }
      const num = Number(value)
      if (Number.isNaN(num)) {
        return value
      }
      return Number.isInteger(num) ? String(num) : num.toFixed(2)
    },

    buildInitialData(post, pileType) {
      const pileObj = post && post.pile_obj
        ? deepClone(post.pile_obj)
        : { pile_type: pileType }

      if (pileObj.pile_type == null) {
        pileObj.pile_type = pileType
      }

      return {
        pile_obj: pileObj,
        pile_desc: post && post.pile_desc ? post.pile_desc : ''
      }
    },

    extractPileDepth(result) {
      if (!result || !result.pile_obj) {
        return undefined
      }
      if (result.pile_obj.pile_depth != null && result.pile_obj.pile_depth !== '') {
        return result.pile_obj.pile_depth
      }
      if (result.pile_obj.pile_body && result.pile_obj.pile_body.length != null) {
        return result.pile_obj.pile_body.length
      }
      return undefined
    },

    setPostPile(post, result) {
      post.pile_type = result.pile_type
      post.pile_obj = deepClone(result.pile_obj)
      post.pile_desc = result.pile_desc

      const depth = this.extractPileDepth(result)
      if (depth != null) {
        post.pile_depth = depth
      } else {
        delete post.pile_depth
      }
    },

    syncDraftTrackerPile(result) {
      this.draftTrackerPile = {
        pile_type: result.pile_type,
        pile_obj: deepClone(result.pile_obj),
        pile_desc: result.pile_desc,
        pile_depth: this.extractPileDepth(result)
      }
    },

    applyDraftPostToTracker(draft) {
      const post = (this.tracker.post_info_lst || []).find(
        (item) => String(item.position) === String(draft.position)
      )
      if (!post) {
        return
      }
      post.pile_type = draft.pile_type
      post.pile_obj = deepClone(draft.pile_obj)
      post.pile_desc = draft.pile_desc
      if (draft.pile_depth != null) {
        post.pile_depth = draft.pile_depth
      } else {
        delete post.pile_depth
      }
    },

    applyDraftToTracker() {
      if (this.isSinglePostMode) {
        const draft = this.getFocusedDraftPost()
        if (draft) {
          this.applyDraftPostToTracker(draft)
        }
        return
      }

      const posts = this.tracker.post_info_lst || []
      this.draftPosts.forEach((draft) => {
        const post = posts.find((item) => String(item.position) === String(draft.position))
        if (!post) {
          return
        }
        this.applyDraftPostToTracker(draft)
      })

      if (this.draftTrackerPile) {
        this.tracker.pile_type = this.draftTrackerPile.pile_type
        this.tracker.pile_obj = deepClone(this.draftTrackerPile.pile_obj)
        this.tracker.pile_desc = this.draftTrackerPile.pile_desc
        if (this.draftTrackerPile.pile_depth != null) {
          this.tracker.pile_depth = this.draftTrackerPile.pile_depth
        } else {
          delete this.tracker.pile_depth
        }
      }
    },

    syncSnapshotAfterSave() {
      if (this.isSinglePostMode) {
        const draft = this.getFocusedDraftPost()
        const initial = this.getFocusedInitialPost()
        if (draft && initial) {
          Object.assign(initial, deepClone(draft))
        }
        return
      }
      this.initialSnapshot = deepClone(this.getDraftState())
    },

    revertChanges() {
      if (!this.initialSnapshot || !this.isDirty) {
        return
      }
      if (this.isSinglePostMode) {
        const initial = this.getFocusedInitialPost()
        const draft = this.getFocusedDraftPost()
        if (initial && draft) {
          Object.assign(draft, deepClone(initial))
        }
      } else {
        this.loadDraftFromSnapshot(this.initialSnapshot)
      }
      this.batchPileType = null
      this.$message.success('已恢复到打开对话框前的状态')
    },

    confirmChanges() {
      if (!this.isDirty) {
        this.dialogVisible = false
        return
      }
      this.applyDraftToTracker()
      this.syncSnapshotAfterSave()
      this.dialogVisible = false
      this.$message.success('桩基修改已保存')
    },

    promptSaveBeforeClose() {
      return this.$confirm('当前有未保存的修改，是否确认保存？', '提示', {
        confirmButtonText: '确认修改',
        cancelButtonText: '放弃修改',
        distinguishCancelAndClose: true,
        type: 'warning'
      })
    },

    handleBeforeClose(done) {
      if (this.pileEditVisible) {
        return
      }
      if (!this.isDirty) {
        done()
        return
      }
      this.promptSaveBeforeClose()
        .then(() => {
          this.applyDraftToTracker()
          done()
        })
        .catch((action) => {
          if (action === 'cancel') {
            done()
          }
        })
    },

    handleCancel() {
      if (!this.isDirty) {
        this.dialogVisible = false
        return
      }
      this.promptSaveBeforeClose()
        .then(() => {
          this.applyDraftToTracker()
          this.dialogVisible = false
          this.$message.success('桩基修改已保存')
        })
        .catch((action) => {
          if (action === 'cancel') {
            this.dialogVisible = false
          }
        })
    },

    openPileForm({ post, pileType, batchMode }) {
      this.batchMode = batchMode
      this.currentPost = post || null
      this.prePileType = post
        ? post.pile_type
        : (this.draftTrackerPile && this.draftTrackerPile.pile_type != null
          ? this.draftTrackerPile.pile_type
          : 2)
      this.currentPileType = pileType * 1
      this.currentScope = post
        ? `post:${this.tracker.id}||${post.position}`
        : `tracker:${this.tracker.id}`
      this.currentInitialData = post
        ? this.buildInitialData(post, pileType)
        : this.buildInitialData(
          {
            pile_obj: this.draftTrackerPile && this.draftTrackerPile.pile_obj,
            pile_desc: this.draftTrackerPile && this.draftTrackerPile.pile_desc
          },
          pileType
        )
      this.pileFormKey += 1
      this.pileEditVisible = true
    },

    openPostPileEdit(post, pileType) {
      this.openPileForm({ post, pileType, batchMode: false })
    },

    openBatchPileEdit(pileType) {
      if (pileType == null || pileType === '') {
        return
      }
      this.openPileForm({ post: null, pileType, batchMode: true })
    },

    onPileReceive(result) {
      if (result.clicked === 'cancel') {
        if (!this.batchMode && this.currentPost) {
          this.currentPost.pile_type = this.prePileType
        }
        if (this.batchMode) {
          this.batchPileType = null
        }
      } else if (this.batchMode) {
        this.draftPosts.forEach((post) => {
          this.setPostPile(post, result)
        })
        this.syncDraftTrackerPile(result)
        this.batchPileType = null
      } else if (this.currentPost) {
        this.setPostPile(this.currentPost, result)
      }
      this.pileEditVisible = false
    },

    handlePileEditClosed() {
      this.batchMode = false
      this.currentPost = null
      this.currentInitialData = null
    },

    handleMainClosed() {
      this.batchPileType = null
      this.pileEditVisible = false
      this.initialSnapshot = null
      this.draftPosts = []
      this.draftTrackerPile = null
      this.teardownDialogDrag()
      this.$emit('closed')
    }
  }
}
</script>

<style>
.tracker-pile-entry-dialog {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(20, 32, 50, 0.22);
}

.tracker-pile-entry-dialog .el-dialog__header {
  padding: 0;
  background: linear-gradient(135deg, #2f4858 0%, #243044 100%);
  border-bottom: 1px solid rgba(94, 196, 188, 0.22);
}

.tracker-pile-entry-dialog .el-dialog__headerbtn {
  top: 15px;
  right: 16px;
}

.tracker-pile-entry-dialog .el-dialog__headerbtn .el-dialog__close {
  color: rgba(255, 255, 255, 0.88);
  font-size: 18px;
}

.tracker-pile-entry-dialog .el-dialog__headerbtn .el-dialog__close:hover {
  color: #5ec4bc;
}

.tracker-pile-entry-dialog .el-dialog__body {
  height: 600px;
  overflow: hidden;
  box-sizing: border-box;
  padding: 16px 20px;
  background: #f4f7fb;
}

.tracker-pile-entry-dialog .pile-entry--single .pile-entry__body {
  margin-top: 0;
}

.tracker-pile-entry-dialog .el-dialog__footer {
  padding: 12px 20px 16px;
  background: #fff;
  border-top: 1px solid #e4e9f0;
}

.tracker-pile-entry-dialog .pile-entry__table {
  border-radius: 6px;
}

.tracker-pile-entry-dialog .pile-entry__table th {
  background: #eef5f4 !important;
  color: #3d5a56;
  font-weight: 600;
}

.tracker-pile-entry-dialog .pile-entry__table td {
  color: #606266;
}

.tracker-pile-entry-dialog .pile-entry__table .el-table__body tr:hover > td {
  background: #f0faf9 !important;
}
</style>

<style scoped>
.pile-entry {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.pile-entry__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-top: 12px;
  padding: 1px;
  background: #fff;
  border: 1px solid #e4e9f0;
  border-radius: 8px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.pile-entry__header {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 52px 0 20px;
}

.pile-entry__header-icon {
  font-size: 18px;
  color: #5ec4bc;
}

.pile-entry__header-title {
  font-size: 16px;
  font-weight: 600;
  color: #f0f4f8;
  letter-spacing: 0.5px;
}

.pile-entry__toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0;
  padding: 12px 14px;
  flex-wrap: wrap;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #e4e9f0;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(20, 32, 50, 0.06);
}

.pile-entry__toolbar-label {
  font-size: 13px;
  font-weight: 600;
  color: #475669;
}

.pile-entry__batch-select {
  width: 140px;
}

.pile-entry__toolbar-hint {
  flex: 1;
  min-width: 220px;
  font-size: 12px;
  color: #909399;
}

.pile-entry__table {
  width: 100%;
}

.pile-entry__desc {
  display: inline-block;
  font-size: 12px;
  line-height: 1.5;
  color: #606266;
  white-space: pre-wrap;
  word-break: break-all;
}

.pile-entry__footer {
  display: inline-flex;
  gap: 10px;
}

.pile-entry__footer ::v-deep .el-button--primary {
  min-width: 96px;
  border-radius: 6px;
}

.pile-entry__footer ::v-deep .el-button--default {
  border-radius: 6px;
}
</style>
