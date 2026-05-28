<template>
  <component
    :is="rootTag"
    v-if="pathValid"
    class="double-click-to-input"
    :class="{
      'double-click-to-input--block': block,
      'double-click-to-input--array': isArrayMode,
      'double-click-to-input--editing': editing,
    }"
  >
    <span
      v-if="!editing"
      :class="displaySpanClass"
      :title="editable ? '双击编辑' : null"
      @dblclick="onDisplayDblclick"
    >{{ textForShow }}</span>
    <div
      v-else-if="isArrayMode"
      class="double-click-to-input__textarea-wrap"
    >
      <el-input
        ref="input"
        v-model="draft"
        type="textarea"
        :rows="arrayRows"
        size="mini"
        class="double-click-to-input__textarea"
        @blur="commit"
        @keyup.esc.native="cancel"
      />
    </div>
    <el-select
      v-else-if="isBooleanMode"
      ref="boolSelect"
      v-model="draftBool"
      size="mini"
      class="double-click-to-input__select"
      @change="commitBoolean"
      @blur="onBooleanSelectBlur"
      @visible-change="onBooleanSelectVisibleChange"
    >
      <el-option :label="resolvedBooleanLabels[0]" :value="true" />
      <el-option :label="resolvedBooleanLabels[1]" :value="false" />
    </el-select>
    <el-select
      v-else-if="isSelectMode"
      ref="optionSelect"
      v-model="draft"
      size="mini"
      filterable
      allow-create
      default-first-option
      :placeholder="editable ? '选择或输入' : ''"
      class="double-click-to-input__select"
      @change="commitSelect"
      @blur="onSelectBlur"
      @visible-change="onSelectVisibleChange"
    >
      <el-option
        v-for="opt in resolvedOptions"
        :key="opt"
        :label="opt"
        :value="opt"
      />
    </el-select>
    <el-date-picker
      v-else-if="isDateMode"
      ref="datePicker"
      v-model="draftDate"
      type="date"
      size="mini"
      class="double-click-to-input__date"
      placeholder="选择日期"
      @change="onDateChange"
      @blur="onDatePickerBlur"
    />
    <el-input
      v-else
      ref="input"
      v-model="draft"
      size="mini"
      class="double-click-to-input__input"
      @blur="commit"
      @keyup.enter.native="commit"
      @keyup.esc.native="cancel"
    />
  </component>
</template>

<script>
function normalizePropName(propName) {
  if (propName === null || propName === undefined) return ''
  const p = String(propName).trim()
  return p.startsWith('q.') ? p.slice(2) : p
}

function getPathKeys(propName) {
  return normalizePropName(propName).split('.').filter(Boolean)
}

export function pathExistsOnObj(obj, propName) {
  const keys = getPathKeys(propName)
  if (!keys.length || obj === null || obj === undefined) return false
  let cur = obj
  for (const key of keys) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return false
    if (!Object.prototype.hasOwnProperty.call(cur, key)) return false
    cur = cur[key]
  }
  return true
}

export function getObjPathValue(obj, propName) {
  const keys = getPathKeys(propName)
  if (!keys.length || obj === null || obj === undefined) return undefined
  let cur = obj
  for (const key of keys) {
    if (cur === null || cur === undefined) return undefined
    cur = cur[key]
  }
  return cur
}

export function setObjPathValue(vm, obj, propName, value) {
  const keys = getPathKeys(propName)
  if (!keys.length || obj === null || obj === undefined) return
  let cur = obj
  for (let i = 0; i < keys.length - 1; i++) {
    cur = cur[keys[i]]
    if (cur === null || cur === undefined) return
  }
  vm.$set(cur, keys[keys.length - 1], value)
}

function isEmptyDisplayValue(value) {
  if (value === null || value === undefined) return true
  if (Array.isArray(value)) return value.length === 0 || value.every(item => isEmptyDisplayValue(item))
  if (typeof value === 'string' && value.trim() === '') return true
  return false
}

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CN_MONTH_TO_EN = {
  '一月': 'Jan', '二月': 'Feb', '三月': 'Mar', '四月': 'Apr',
  '五月': 'May', '六月': 'Jun', '七月': 'Jul', '八月': 'Aug',
  '九月': 'Sep', '十月': 'Oct', '十一月': 'Nov', '十二月': 'Dec',
}

/** 格式化为报价单英文日期：dd-MMM-yyyy，如 06-May-2026 */
export function formatQuotationDateEnglish(input) {
  if (input === null || input === undefined || input === '') return ''
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) return ''
    const day = String(input.getDate()).padStart(2, '0')
    return `${day}-${MONTH_EN[input.getMonth()]}-${input.getFullYear()}`
  }
  const str = String(input).trim()
  const enMatch = str.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/)
  if (enMatch) {
    const monthKey = enMatch[2].toLowerCase()
    const month = MONTH_EN.find(m => m.toLowerCase() === monthKey) || (
      enMatch[2].charAt(0).toUpperCase() + enMatch[2].slice(1, 3).toLowerCase()
    )
    return `${enMatch[1].padStart(2, '0')}-${month}-${enMatch[3]}`
  }
  const hybridMatch = str.match(/^(\d{1,2})-(.+?)-(\d{4})$/)
  if (hybridMatch) {
    const enMonth = CN_MONTH_TO_EN[hybridMatch[2]]
    if (enMonth) {
      return `${hybridMatch[1].padStart(2, '0')}-${enMonth}-${hybridMatch[3]}`
    }
  }
  const parsed = new Date(str)
  if (!Number.isNaN(parsed.getTime())) {
    return formatQuotationDateEnglish(parsed)
  }
  return str
}

function parseQuotationDateEnglish(value) {
  const formatted = formatQuotationDateEnglish(value)
  if (!formatted) return null
  const match = formatted.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})$/)
  if (!match) return null
  const monthIndex = MONTH_EN.indexOf(match[2])
  if (monthIndex < 0) return null
  return new Date(Number(match[3]), monthIndex, Number(match[1]))
}

/** 属性名是否按日期字段处理 */
function isDatePropName(propName) {
  const n = normalizePropName(propName).toLowerCase()
  return (
    n.endsWith('_date') ||
    n.endsWith('.quotation_date') ||
    n.endsWith('quotation_valid_until') ||
    n.endsWith('.valid_until') ||
    n.includes('quotation_date') ||
    n.includes('quotation_valid_until')
  )
}

export default {
  name: 'DoubleClickToInput',
  props: {
    obj: {
      type: Object,
      required: true,
    },
    propName: {
      type: String,
      required: true,
    },
    /** 为 true 时，提交结果尝试转为数字（如 capacity） */
    numeric: {
      type: Boolean,
      default: false,
    },
    /** 强制按日期选择器编辑 */
    date: {
      type: Boolean,
      default: false,
    },
    /** 日期存储/显示格式，默认与报价单 cover 一致 */
    dateFormat: {
      type: String,
      default: 'dd-MMM-yyyy',
    },
    /** 块级布局（用于 Note 等多行区域） */
    block: {
      type: Boolean,
      default: false,
    },
    /** 附加到展示文字的 class */
    displayClass: {
      type: String,
      default: '',
    },
    /** 数组编辑时 textarea 行数 */
    arrayRows: {
      type: Number,
      default: 4,
    },
    /** false 时仅展示普通文本，不可双击编辑 */
    editable: {
      type: Boolean,
      default: true,
    },
    /**
     * 布尔值为 true/false 时的展示文案，长度须为 2：[true 对应, false 对应]
     * 未传或非法时默认为 ['true', 'false']
     */
    booleanLabels: {
      type: Array,
      default: () => ['true', 'false'],
    },
    /** 数组展示时是否在每行前加 1）、2）… 序号，默认 true */
    arrayNumbered: {
      type: Boolean,
      default: true,
    },
    /**
     * 字符串/数字字段的可选值；传入且非空时，双击用下拉选择（可筛选、可手工输入新值）
     * 勿与数组类型字段混用（数组字段请用数据本身的数组 + arrayNumbered）
     */
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      editing: false,
      draft: '',
      draftDate: null,
      draftBool: true,
      booleanSelectOpen: false,
      selectOpen: false,
    }
  },
  computed: {
    normalizedPropName() {
      return normalizePropName(this.propName)
    },
    pathValid() {
      return pathExistsOnObj(this.obj, this.propName)
    },
    rawValue() {
      if (!this.pathValid) return undefined
      return getObjPathValue(this.obj, this.propName)
    },
    isArrayMode() {
      return Array.isArray(this.rawValue)
    },
    isBooleanMode() {
      return this.pathValid && typeof this.rawValue === 'boolean'
    },
    resolvedBooleanLabels() {
      const labels = this.booleanLabels
      if (Array.isArray(labels) && labels.length === 2) {
        return [String(labels[0]), String(labels[1])]
      }
      return ['true', 'false']
    },
    isScalarValue() {
      const t = typeof this.rawValue
      return t === 'string' || t === 'number'
    },
    resolvedOptions() {
      if (!Array.isArray(this.options)) return []
      return this.options
        .filter(opt => opt !== null && opt !== undefined && String(opt).trim() !== '')
        .map(opt => String(opt))
    },
    isSelectMode() {
      if (!this.pathValid || this.isArrayMode || this.isBooleanMode) return false
      if (!this.isScalarValue) return false
      if (this.date || isDatePropName(this.propName)) return false
      return this.resolvedOptions.length > 0
    },
    isDateMode() {
      if (this.isArrayMode || this.isBooleanMode || this.isSelectMode) return false
      return this.date || isDatePropName(this.propName)
    },
    rootTag() {
      return this.block || this.isArrayMode ? 'div' : 'span'
    },
    emptyPlaceholder() {
      return this.editable ? '    ' : ''
    },
    displayText() {
      if (!this.pathValid) return ''
      if (isEmptyDisplayValue(this.rawValue)) return this.emptyPlaceholder
      if (this.isArrayMode) {
        const items = this.rawValue.filter(item => item !== null && item !== undefined && String(item).trim() !== '')
        if (items.length === 0) return this.emptyPlaceholder
        if (items.length === 1) return String(items[0])
        if (this.arrayNumbered) {
          return items.map((item, index) => `${index + 1}）${item}`).join('\n')
        }
        return items.map(item => String(item)).join('\n')
      }
      if (this.isBooleanMode) {
        return this.rawValue === true ? this.resolvedBooleanLabels[0] : this.resolvedBooleanLabels[1]
      }
      if (this.isDateMode) {
        return formatQuotationDateEnglish(this.rawValue) || this.emptyPlaceholder
      }
      return String(this.rawValue)
    },
    displaySpanClass() {
      const classes = []
      if (this.editable) {
        classes.push('double-click-to-input__display')
      } else if (this.isArrayMode) {
        classes.push('double-click-to-input__display-readonly')
      }
      if (this.displayClass) {
        classes.push(this.displayClass)
      }
      return classes.length ? classes : null
    },
    textForShow() {
      return this.displayText
    },
  },
  watch: {
    editable(val) {
      if (!val) this.cancel()
    },
  },
  methods: {
    onDisplayDblclick() {
      if (this.editable) this.startEdit()
    },
    startEdit() {
      if (!this.editable || !this.pathValid) return
      this.editing = true
      if (this.isArrayMode) {
        const items = Array.isArray(this.rawValue) ? this.rawValue : []
        this.draft = items
          .map(item => (item === null || item === undefined ? '' : String(item)))
          .join('\n')
      } else if (this.isBooleanMode) {
        this.draftBool = this.rawValue === true
      } else if (this.isSelectMode || this.isDateMode) {
        if (this.isDateMode) {
          this.draftDate = parseQuotationDateEnglish(this.rawValue)
          this.draft = formatQuotationDateEnglish(this.rawValue)
        } else {
          this.draft = isEmptyDisplayValue(this.rawValue) ? '' : String(this.rawValue)
        }
      } else {
        this.draft = isEmptyDisplayValue(this.rawValue) ? '' : String(this.rawValue)
      }
      this.$nextTick(() => this.focusEditor())
    },
    focusEditor() {
      if (this.isSelectMode) {
        const sel = this.$refs.optionSelect
        if (sel && sel.focus) sel.focus()
        return
      }
      if (this.isBooleanMode) {
        const sel = this.$refs.boolSelect
        if (sel && sel.focus) sel.focus()
        return
      }
      if (this.isDateMode) {
        const picker = this.$refs.datePicker
        if (picker && picker.focus) picker.focus()
        return
      }
      const ref = this.$refs.input
      const input = ref && (ref.$refs ? ref.$refs.input : ref)
      if (input && input.focus) input.focus()
      else if (ref && ref.focus) ref.focus()
    },
    commit() {
      if (!this.editing || !this.pathValid) return
      let value
      if (this.isArrayMode) {
        value = (this.draft || '')
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line.length > 0)
      } else if (this.isBooleanMode) {
        value = this.draftBool === true
      } else if (this.isDateMode) {
        value = formatQuotationDateEnglish(this.draftDate || this.draft)
        if (!value) return
      } else if (this.isSelectMode) {
        this.commitScalarValue()
        return
      } else {
        this.commitScalarValue()
        return
      }
      setObjPathValue(this, this.obj, this.propName, value)
      this.editing = false
      this.draft = ''
      this.draftDate = null
      this.draftBool = true
      this.booleanSelectOpen = false
      this.selectOpen = false
      this.$emit('change', value)
    },
    commitScalarValue() {
      if (!this.editing || !this.pathValid) return
      let value = (this.draft || '').trim()
      if (value === '' && !this.isSelectMode) return
      if (this.numeric && value !== '') {
        const num = Number(value)
        value = Number.isNaN(num) ? value : num
      }
      setObjPathValue(this, this.obj, this.propName, value)
      this.editing = false
      this.draft = ''
      this.draftDate = null
      this.draftBool = true
      this.booleanSelectOpen = false
      this.selectOpen = false
      this.$emit('change', value)
    },
    commitSelect() {
      if (!this.editing || !this.isSelectMode) return
      this.commitScalarValue()
    },
    commitBoolean() {
      if (!this.editing || !this.isBooleanMode) return
      this.commit()
    },
    onSelectVisibleChange(visible) {
      this.selectOpen = visible
    },
    onSelectBlur() {
      window.setTimeout(() => {
        if (this.editing && this.isSelectMode && !this.selectOpen) {
          this.commitScalarValue()
        }
      }, 200)
    },
    onBooleanSelectVisibleChange(visible) {
      this.booleanSelectOpen = visible
    },
    onBooleanSelectBlur() {
      window.setTimeout(() => {
        if (this.editing && this.isBooleanMode && !this.booleanSelectOpen) {
          this.commit()
        }
      }, 200)
    },
    onDateChange(val) {
      if (!this.editing) return
      const formatted = formatQuotationDateEnglish(val)
      if (!formatted) return
      this.draft = formatted
      this.draftDate = parseQuotationDateEnglish(formatted)
      this.commit()
    },
    onDatePickerBlur() {
      window.setTimeout(() => {
        if (this.editing && this.isDateMode) {
          this.cancel()
        }
      }, 200)
    },
    cancel() {
      this.editing = false
      this.draft = ''
      this.draftDate = null
      this.draftBool = true
      this.booleanSelectOpen = false
      this.selectOpen = false
    },
  },
}
</script>

<style lang="scss" scoped>
.double-click-to-input {
  display: inline;
}

.double-click-to-input--block {
  display: block;
  width: 100%;
}

.double-click-to-input--array {
  display: block;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.double-click-to-input--array > span {
  display: block;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
}

.double-click-to-input--array .double-click-to-input__display {
  display: block;
  width: 100%;
  white-space: pre-wrap;
}

.double-click-to-input__display-readonly {
  display: block;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
}

.double-click-to-input__display {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
  word-break: break-word;
  white-space: pre-wrap;
}

.double-click-to-input__input {
  display: inline-block;
  width: auto;
  min-width: 100px;
  max-width: min(420px, 100%);
  vertical-align: baseline;

  ::v-deep .el-input__inner {
    color: #409eff;
    text-decoration: underline;
    border-color: #409eff;
  }
}

.double-click-to-input__textarea-wrap {
  display: block;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.double-click-to-input__textarea {
  display: block;
  width: 100% !important;
  max-width: 100% !important;

  ::v-deep .el-textarea {
    display: block;
    width: 100% !important;
    max-width: 100% !important;
  }

  ::v-deep .el-textarea__inner {
    display: block;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box;
    color: #409eff;
    border-color: #409eff;
    font-size: 12px;
    line-height: 1.5;
    resize: vertical;
  }
}

.double-click-to-input__select {
  min-width: 120px;
  vertical-align: middle;

  ::v-deep .el-input__inner {
    color: #409eff;
    border-color: #409eff;
  }
}

.double-click-to-input__date {
  width: 160px;
  vertical-align: middle;

  ::v-deep .el-input__inner {
    color: #409eff;
    border-color: #409eff;
  }
}
</style>
