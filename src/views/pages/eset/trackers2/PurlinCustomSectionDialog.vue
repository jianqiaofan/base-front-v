<template>
  <el-dialog
    title="自定义截面"
    :visible.sync="dialogVisible"
    width="460px"
    append-to-body
    :close-on-click-modal="false"
    @closed="handleDialogClosed"
  >
    <el-form label-width="96px" size="small" class="purlin-custom-section">
      <el-form-item label="截面类型">
        <el-select v-model="sectionTypeKey" class="purlin-custom-section__type">
          <el-option
            v-for="item in sectionTypes"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-for="field in currentFields"
        :key="field.key"
        :label="field.label"
        :error="fieldErrors[field.key]"
      >
        <el-input
          :value="form[field.key]"
          :placeholder="getFieldPlaceholder(field)"
          clearable
          @input="handleFieldInput(field, $event)"
          @blur="validateSingleField(field)"
          @clear="validateSingleField(field)"
        >
          <template slot="append">mm</template>
        </el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="purlin-custom-section__footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :disabled="!isFormValid" @click="handleConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  PURLIN_CUSTOM_SECTION_TYPES,
  getPurlinSectionTypeByKey,
  createDefaultFormForType,
  isPurlinSectionFormValid,
  clonePurlinSectionForm,
  parsePurlinSection,
  sanitizePurlinSectionInput,
  validatePurlinSectionField,
  parsePurlinSectionFieldValue
} from '@/views/pages/eset/trackers2/utils/purlinCustomSectionTypes.js'

export default {
  name: 'PurlinCustomSectionDialog',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    initialSection: {
      type: [String, Number],
      default: ''
    }
  },

  data() {
    return {
      sectionTypes: PURLIN_CUSTOM_SECTION_TYPES,
      sectionTypeKey: PURLIN_CUSTOM_SECTION_TYPES[0].key,
      form: createDefaultFormForType(PURLIN_CUSTOM_SECTION_TYPES[0].key),
      fieldErrors: {},
      lastValidForms: {}
    }
  },

  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    },

    currentType() {
      return getPurlinSectionTypeByKey(this.sectionTypeKey)
    },

    currentFields() {
      return this.currentType.fields || []
    },

    isFormValid() {
      return this.currentFields.every((field) =>
        !validatePurlinSectionField(this.form[field.key], field.kind)
      )
    }
  },

  watch: {
    sectionTypeKey(newKey, oldKey) {
      if (oldKey && oldKey !== newKey) {
        this.persistValidForm(oldKey)
      }
      this.form = this.loadFormForType(newKey)
      this.fieldErrors = {}
    },

    visible(value) {
      if (value) {
        this.initDialog()
      }
    }
  },

  methods: {
    getFieldPlaceholder(field) {
      return field.kind === 'integer' ? '正整数' : '正整数或一位小数'
    },

    handleFieldInput(field, value) {
      const sanitized = sanitizePurlinSectionInput(value, field.kind)
      this.$set(this.form, field.key, sanitized)

      if (this.fieldErrors[field.key]) {
        const message = validatePurlinSectionField(sanitized, field.kind)
        this.$set(this.fieldErrors, field.key, message)
      }
    },

    validateSingleField(field) {
      const message = validatePurlinSectionField(this.form[field.key], field.kind)
      this.$set(this.fieldErrors, field.key, message)
      if (!message) {
        this.persistValidForm(this.sectionTypeKey)
      }
    },

    loadFormForType(sectionTypeKey) {
      const cached = this.lastValidForms[sectionTypeKey]
      if (cached) {
        return clonePurlinSectionForm(cached)
      }
      return createDefaultFormForType(sectionTypeKey)
    },

    persistValidForm(sectionTypeKey, form = this.form) {
      if (!isPurlinSectionFormValid(sectionTypeKey, form)) {
        return
      }
      this.$set(this.lastValidForms, sectionTypeKey, clonePurlinSectionForm(form))
    },

    initDialog() {
      this.fieldErrors = {}

      const parsed = parsePurlinSection(this.initialSection)
      if (parsed) {
        this.$set(this.lastValidForms, parsed.typeKey, clonePurlinSectionForm(parsed.form))
        if (this.sectionTypeKey !== parsed.typeKey) {
          this.sectionTypeKey = parsed.typeKey
        } else {
          this.form = clonePurlinSectionForm(parsed.form)
        }
        return
      }

      this.form = this.loadFormForType(this.sectionTypeKey)
    },

    handleDialogClosed() {
      this.fieldErrors = {}
    },

    validateForm() {
      const errors = {}
      let valid = true

      this.currentFields.forEach((field) => {
        const message = validatePurlinSectionField(this.form[field.key], field.kind)
        errors[field.key] = message
        if (message) {
          valid = false
        }
      })

      this.fieldErrors = errors
      return valid
    },

    buildSectionValues() {
      const values = {}
      this.currentFields.forEach((field) => {
        values[field.key] = parsePurlinSectionFieldValue(this.form[field.key], field.kind)
      })
      return values
    },

    handleCancel() {
      this.dialogVisible = false
    },

    handleConfirm() {
      if (!this.validateForm()) {
        this.$message.warning('请检查输入内容')
        return
      }

      const section = this.currentType.buildSection(this.buildSectionValues())
      this.persistValidForm(this.sectionTypeKey)
      this.$emit('confirm', section)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.purlin-custom-section__type {
  width: 100%;
}

.purlin-custom-section >>> .el-input-group__append {
  padding: 0 10px;
  color: #909399;
}

.purlin-custom-section__footer {
  display: inline-flex;
  gap: 8px;
}
</style>
