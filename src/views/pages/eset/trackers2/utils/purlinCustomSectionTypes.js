/**
 * 檩条自定义截面类型注册表。
 * 扩展新截面类型时，只需在此数组中追加配置项。
 */
export const PURLIN_CUSTOM_SECTION_TYPES = [
  {
    key: 'omega',
    label: '几字型截面',
    defaults: { h: 50, b: 30, c: 30, t: 1.5 },
    fields: [
      { key: 'h', label: '高度(h)', kind: 'integer' },
      { key: 'b', label: '宽度(b)', kind: 'integer' },
      { key: 'c', label: '肢长(c)', kind: 'integer' },
      { key: 't', label: '厚度(t)', kind: 'decimal1' }
    ],
    buildSection(values) {
      const { h, b, c, t } = values
      return `-${formatDecimal1(t)}x${c}x${b}x${h}`
    },
    parseSection(section) {
      const match = String(section).trim().match(/^-(\d+(?:\.\d)?)x([1-9]\d*)x([1-9]\d*)x([1-9]\d*)$/)
      if (!match) {
        return null
      }
      return {
        h: match[4],
        b: match[3],
        c: match[2],
        t: match[1]
      }
    }
  },
  {
    key: 'c_steel',
    label: 'C型钢截面',
    defaults: { h: 60, b: 40, c: 20, t: 2.0 },
    fields: [
      { key: 'h', label: '高度(h)', kind: 'integer' },
      { key: 'b', label: '宽度(b)', kind: 'integer' },
      { key: 'c', label: '卷边(c)', kind: 'integer' },
      { key: 't', label: '厚度(t)', kind: 'decimal1' }
    ],
    buildSection(values) {
      const { h, b, c, t } = values
      return `C${h}x${b}x${c}x${formatDecimal1(t)}`
    },
    parseSection(section) {
      const match = String(section).trim().match(/^C([1-9]\d*)x([1-9]\d*)x([1-9]\d*)x(\d+(?:\.\d)?)$/)
      if (!match) {
        return null
      }
      return {
        h: match[1],
        b: match[2],
        c: match[3],
        t: match[4]
      }
    }
  }
]

export function getPurlinSectionTypeByKey(key) {
  return PURLIN_CUSTOM_SECTION_TYPES.find((item) => item.key === key) || PURLIN_CUSTOM_SECTION_TYPES[0]
}

export function createDefaultFormForType(sectionTypeKey) {
  const type = getPurlinSectionTypeByKey(sectionTypeKey)
  const defaults = type.defaults || {}
  const form = {}

  ;(type.fields || []).forEach((field) => {
    const value = defaults[field.key]
    form[field.key] = value != null ? String(value) : ''
  })

  return form
}

export function isPurlinSectionFormValid(sectionTypeKey, form) {
  const type = getPurlinSectionTypeByKey(sectionTypeKey)
  return (type.fields || []).every((field) =>
    !validatePurlinSectionField(form[field.key], field.kind)
  )
}

export function clonePurlinSectionForm(form) {
  return { ...form }
}

/** 将截面字符串反解析为类型与表单值，无法识别时返回 null */
export function parsePurlinSection(section) {
  if (section == null || String(section).trim() === '') {
    return null
  }

  const text = String(section).trim()

  for (let i = 0; i < PURLIN_CUSTOM_SECTION_TYPES.length; i++) {
    const type = PURLIN_CUSTOM_SECTION_TYPES[i]
    if (typeof type.parseSection !== 'function') {
      continue
    }

    const form = type.parseSection(text)
    if (!form || !isPurlinSectionFormValid(type.key, form)) {
      continue
    }

    const values = {}
    type.fields.forEach((field) => {
      values[field.key] = parsePurlinSectionFieldValue(form[field.key], field.kind)
    })

    if (type.buildSection(values) !== text) {
      continue
    }

    return {
      typeKey: type.key,
      form: clonePurlinSectionForm(form)
    }
  }

  return null
}

function formatDecimal1(value) {
  const num = Number(value)
  return (Math.round(num * 10) / 10).toFixed(1)
}

/** 输入过程中过滤非法字符 */
export function sanitizePurlinSectionInput(value, kind) {
  let text = value != null ? String(value) : ''

  if (kind === 'integer') {
    return text.replace(/\D/g, '')
  }

  if (kind === 'decimal1') {
    text = text.replace(/[^\d.]/g, '')
    const dotIndex = text.indexOf('.')
    if (dotIndex === -1) {
      return text
    }
    const intPart = text.slice(0, dotIndex)
    const decPart = text.slice(dotIndex + 1).replace(/\./g, '').slice(0, 1)
    return `${intPart}.${decPart}`
  }

  return text
}

export function validatePurlinSectionField(value, kind) {
  const text = value != null ? String(value).trim() : ''
  if (text === '') {
    return '请输入数值'
  }

  if (kind === 'integer') {
    if (!/^[1-9]\d*$/.test(text)) {
      return '请输入有效的正整数'
    }
    return ''
  }

  if (kind === 'decimal1') {
    if (!/^\d+(\.\d)?$/.test(text)) {
      return '请输入正整数或最多一位小数'
    }
    const num = Number(text)
    if (Number.isNaN(num) || num <= 0) {
      return '请输入大于 0 的数值'
    }
    return ''
  }

  return ''
}

export function parsePurlinSectionFieldValue(value, kind) {
  const text = String(value).trim()
  if (kind === 'integer') {
    return parseInt(text, 10)
  }
  return Number(text)
}
