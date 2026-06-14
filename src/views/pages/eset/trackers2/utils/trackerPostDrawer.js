const COLORS = {
  background: '#243044',
  postLine: '#b8c0cc',
  postBody: '#c5cdd8',
  bracket: '#5a6573',
  bracketHighlight: '#8a939e',
  drivePostLine: '#ffd866',
  drivePostBody: '#f0b830',
  drivePostBracket: '#c87818',
  drivePostBracketHighlight: '#ffe08a',
  label: '#5ec4bc',
  spanLabel: '#5adb8f',
  ratioHigh: '#ff5c5c',
  ratioNormal: '#5adb8f',
  headerPanelBg: 'rgba(20, 30, 46, 0.92)',
  headerPanelBorder: 'rgba(94, 196, 188, 0.35)',
  headerPanelHighlight: 'rgba(255, 255, 255, 0.06)',
  headerLabel: '#7d94ad',
  headerValuePrimary: '#5ec4bc',
  headerValueSecondary: '#e8edf3',
  headerAccentStart: '#6dd4cc',
  headerAccentEnd: '#3a9e96',
  headerDivider: 'rgba(94, 196, 188, 0.18)',
  modifiedSection: '#ffd866',
  pileInfoType0: '#b48cff',
  pileInfoType1: '#5eb8ff',
  pileInfoType2: '#ffd866',
  pileInfoType3: '#5adb8f'
}

const BEAM_COLOR_SETS = [
  { top: '#d8dde4', mid: '#b0bac6', bottom: '#7f8a98', stroke: '#667280' },
  { top: '#b8d4ec', mid: '#8eb8d8', bottom: '#5e8eb0', stroke: '#4a7596' },
  { top: '#e8d4b8', mid: '#d0b890', bottom: '#a88860', stroke: '#8a7048' },
  { top: '#b8e8d0', mid: '#88d0a8', bottom: '#58a878', stroke: '#448860' },
  { top: '#d4b8e8', mid: '#b890d0', bottom: '#8860a8', stroke: '#704890' }
]

const BASE = {
  postWidth: 12,
  drivePostWidthRatio: 0.5,
  nonDrivePostWidthRatio: 1 / 3,
  mainBodyHeight: 36,
  topLineHeight: 22,
  bottomLineHeight: 18,
  beamHeight: 8,
  beamExtend: 30,
  bracketWidth: 18,
  bracketHeight: 10,
  lineWidth: 2,
  fontSize: 11,
  textLineHeight: 14,
  textGap: 8,
  beamY: 82,
  spanLabelGap: 10,
  spanFontSize: 12,
  thicknessLabelGap: 6,
  thicknessFontSize: 11,
  thicknessConflictOffsetY: 10,
  beamRatioLabelGap: 4,
  beamRatioFontSize: 11,
  headerMarginTop: 10,
  headerMarginLeft: 12,
  headerPaddingX: 14,
  headerPaddingY: 7,
  headerColumnGap: 20,
  headerInlineGap: 5,
  headerFontSize: 12,
  headerCornerRadius: 6,
  headerAccentWidth: 3,
  padding: 24
}

function createLayoutMapper(postList, beamList, width, padding) {
  const values = []

  ;(postList || []).forEach((item) => {
    values.push(Number(item.position))
  })
  ;(beamList || []).forEach((beam) => {
    values.push(Number(beam.start), Number(beam.end))
  })

  const drawableWidth = width - padding * 2

  if (!values.length) {
    return () => width / 2
  }

  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const range = maxVal - minVal

  return (value) => {
    if (range === 0) {
      return width / 2
    }
    return padding + ((Number(value) - minVal) / range) * drawableWidth
  }
}

function drawTorqueTubeSegment(ctx, left, right, beamY, horizontalScale, verticalScale, colorSet) {
  const height = BASE.beamHeight * verticalScale
  const y = beamY - height / 2
  const segmentWidth = right - left

  if (segmentWidth <= 0) {
    return
  }

  const gradient = ctx.createLinearGradient(0, y, 0, y + height)
  gradient.addColorStop(0, colorSet.top)
  gradient.addColorStop(0.55, colorSet.mid)
  gradient.addColorStop(1, colorSet.bottom)

  ctx.fillStyle = gradient
  ctx.fillRect(left, y, segmentWidth, height)

  ctx.strokeStyle = colorSet.stroke
  ctx.lineWidth = Math.max(1, horizontalScale)
  ctx.strokeRect(left, y, segmentWidth, height)
}

function drawBeamList(ctx, beamList, toX, beamY, horizontalScale, verticalScale) {
  const sortedBeams = beamList
    .slice()
    .sort((a, b) => Number(a.start) - Number(b.start))

  sortedBeams.forEach((beam, index) => {
    const left = toX(beam.start)
    const right = toX(beam.end)
    const colorSet = BEAM_COLOR_SETS[index % BEAM_COLOR_SETS.length]

    drawTorqueTubeSegment(ctx, left, right, beamY, horizontalScale, verticalScale, colorSet)
  })
}

function drawFallbackBeam(ctx, postList, toX, beamY, horizontalScale, verticalScale, width, padding) {
  const xs = postList.map((post) => toX(post.position))
  const beamLeft = Math.max(padding * 0.5, Math.min(...xs) - BASE.beamExtend * horizontalScale)
  const beamRight = Math.min(width - padding * 0.5, Math.max(...xs) + BASE.beamExtend * horizontalScale)

  drawTorqueTubeSegment(
    ctx,
    beamLeft,
    beamRight,
    beamY,
    horizontalScale,
    verticalScale,
    BEAM_COLOR_SETS[0]
  )
}

function getBeamExtents(beamList, postList) {
  const postPositions = (postList || []).map((post) => Number(post.position))

  if (beamList && beamList.length > 0) {
    return {
      start: Math.min(...beamList.map((beam) => Number(beam.start))),
      end: Math.max(...beamList.map((beam) => Number(beam.end)))
    }
  }

  if (!postPositions.length) {
    return { start: 0, end: 0 }
  }

  return {
    start: Math.min(...postPositions),
    end: Math.max(...postPositions)
  }
}

function buildSpanLabels(postList, beamList) {
  const sortedPosts = (postList || [])
    .slice()
    .sort((a, b) => Number(a.position) - Number(b.position))
  const positions = sortedPosts.map((post) => Number(post.position))

  if (!positions.length) {
    return []
  }

  const { start: beamStart, end: beamEnd } = getBeamExtents(beamList, postList)
  const spans = []

  if (beamStart < positions[0]) {
    spans.push({
      start: beamStart,
      end: positions[0],
      distance: positions[0] - beamStart
    })
  }

  for (let i = 0; i < positions.length - 1; i++) {
    spans.push({
      start: positions[i],
      end: positions[i + 1],
      distance: positions[i + 1] - positions[i]
    })
  }

  if (beamEnd > positions[positions.length - 1]) {
    spans.push({
      start: positions[positions.length - 1],
      end: beamEnd,
      distance: beamEnd - positions[positions.length - 1]
    })
  }

  return spans.filter((span) => span.distance > 0)
}

function buildSpanLabelsFromBeamInfoLst1(beamInfoLst1) {
  return (beamInfoLst1 || [])
    .map((beam) => ({
      start: Number(beam.start),
      end: Number(beam.end),
      distance: Number(beam.length)
    }))
    .filter((span) => !Number.isNaN(span.distance) && span.distance > 0)
}

function buildBeamRatioLabels(beamInfoLst1) {
  return (beamInfoLst1 || [])
    .filter((beam) => beam.ratio != null && beam.ratio !== '' && Number(beam.ratio) > 0)
    .map((beam) => ({
      start: Number(beam.start),
      end: Number(beam.end),
      ratio: Number(beam.ratio)
    }))
    .filter((label) => !Number.isNaN(label.ratio))
}

function getBeamRatioLabelY(beamY, horizontalScale, verticalScale) {
  const hs = horizontalScale
  const vs = verticalScale
  const thicknessFontSize = Math.max(10, Math.round(BASE.thicknessFontSize * hs))
  const ratioFontSize = Math.max(10, Math.round(BASE.beamRatioFontSize * hs))
  const thicknessY = beamY + (BASE.beamHeight * vs) / 2 + BASE.thicknessLabelGap * vs

  return thicknessY + thicknessFontSize + BASE.beamRatioLabelGap * vs + ratioFontSize
}

function getBeamLength(beam) {
  if (beam.length != null && beam.length !== '') {
    return Number(beam.length)
  }
  return Number(beam.end) - Number(beam.start)
}

function normalizeBeamTypeName(type) {
  if (type == null || type === '') {
    return ''
  }

  const text = String(type).trim()
  if (/^actagon$/i.test(text)) {
    return 'Octagon'
  }
  return text
}

function buildBeamTypeText(beamSectionType, beamSectionDim) {
  const type = normalizeBeamTypeName(beamSectionType)
  const dim = beamSectionDim != null ? String(beamSectionDim).trim() : ''

  if (type && dim) {
    return `${type}-${dim}`
  }
  return type || dim
}

function resolveBeamMaterial(beamList) {
  if (!beamList || !beamList.length) {
    return ''
  }

  let longestBeam = beamList[0]
  let maxLength = getBeamLength(longestBeam)

  for (let i = 1; i < beamList.length; i++) {
    const length = getBeamLength(beamList[i])
    if (length > maxLength) {
      maxLength = length
      longestBeam = beamList[i]
    }
  }

  return longestBeam.material != null ? String(longestBeam.material) : ''
}

function resolveBeamTotalLengthMm(beamList, beamLength) {
  if (beamLength != null && beamLength !== '') {
    const length = Number(beamLength)
    if (!Number.isNaN(length) && length > 0) {
      return length
    }
  }

  if (!beamList || !beamList.length) {
    return null
  }

  const { start, end } = getBeamExtents(beamList, [])
  const length = end - start
  return length > 0 ? length : null
}

function formatBeamLengthMeters(lengthMm) {
  if (lengthMm == null || Number.isNaN(lengthMm)) {
    return ''
  }

  return `${(lengthMm / 1000).toFixed(3)} m`
}

const HEADER_FONT =
  '"Segoe UI", "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif'

function roundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)

  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function measureHeaderColumns(ctx, columns, fontSize, inlineGap) {
  columns.forEach((column) => {
    ctx.font = `500 ${fontSize}px ${HEADER_FONT}`
    const labelText = `${column.label}:`
    const labelWidth = ctx.measureText(labelText).width + inlineGap

    ctx.font = `600 ${fontSize}px ${HEADER_FONT}`
    const valueWidth = ctx.measureText(column.value).width

    column.labelText = labelText
    column.width = labelWidth + valueWidth
  })
}

function drawBeamHeader(ctx, options, horizontalScale) {
  const beamType = buildBeamTypeText(options.beamSectionType, options.beamSectionDim)
  const beamMaterial = resolveBeamMaterial(options.beamList || [])
  const beamTotalLengthText = formatBeamLengthMeters(
    resolveBeamTotalLengthMm(options.beamList || [], options.beamLength)
  )

  if (!beamType && !beamMaterial && !beamTotalLengthText) {
    return
  }

  const hs = horizontalScale
  const fontSize = Math.max(11, Math.round(BASE.headerFontSize * hs))
  const padX = Math.round(BASE.headerPaddingX * hs)
  const padY = Math.round(BASE.headerPaddingY * hs)
  const columnGap = Math.round(BASE.headerColumnGap * hs)
  const inlineGap = Math.round(BASE.headerInlineGap * hs)
  const cornerRadius = Math.round(BASE.headerCornerRadius * hs)
  const accentWidth = Math.max(2, Math.round(BASE.headerAccentWidth * hs))
  const marginTop = Math.round(BASE.headerMarginTop * hs)
  const marginLeft = Math.round(BASE.headerMarginLeft * hs)

  const columns = []
  if (beamType) {
    columns.push({ label: 'Beam Type', value: beamType, accent: true })
  }
  if (beamMaterial) {
    columns.push({ label: 'Beam Material', value: beamMaterial, accent: false })
  }
  if (beamTotalLengthText) {
    columns.push({ label: 'Beam Length', value: beamTotalLengthText, accent: false })
  }

  measureHeaderColumns(ctx, columns, fontSize, inlineGap)

  const contentWidth = columns.reduce((sum, column) => sum + column.width, 0)
  const dividersWidth = Math.max(0, columns.length - 1) * columnGap
  const panelWidth = accentWidth + padX * 2 + contentWidth + dividersWidth
  const panelHeight = padY * 2 + fontSize
  const panelX = marginLeft
  const panelY = marginTop
  const textY = panelY + panelHeight / 2

  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.38)'
  ctx.shadowBlur = Math.round(10 * hs)
  ctx.shadowOffsetY = Math.round(2 * hs)
  roundRectPath(ctx, panelX, panelY, panelWidth, panelHeight, cornerRadius)
  ctx.fillStyle = COLORS.headerPanelBg
  ctx.fill()
  ctx.restore()

  ctx.save()
  roundRectPath(ctx, panelX, panelY, panelWidth, panelHeight, cornerRadius)
  ctx.clip()

  const accentGradient = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelHeight)
  accentGradient.addColorStop(0, COLORS.headerAccentStart)
  accentGradient.addColorStop(1, COLORS.headerAccentEnd)
  ctx.fillStyle = accentGradient
  ctx.fillRect(panelX, panelY, accentWidth, panelHeight)
  ctx.restore()

  roundRectPath(ctx, panelX, panelY, panelWidth, panelHeight, cornerRadius)
  ctx.strokeStyle = COLORS.headerPanelBorder
  ctx.lineWidth = Math.max(1, hs)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(panelX + cornerRadius, panelY + 1)
  ctx.lineTo(panelX + panelWidth - cornerRadius, panelY + 1)
  ctx.strokeStyle = COLORS.headerPanelHighlight
  ctx.lineWidth = 1
  ctx.stroke()

  let contentX = panelX + accentWidth + padX

  columns.forEach((column, index) => {
    if (index > 0) {
      const dividerX = contentX - columnGap / 2
      ctx.beginPath()
      ctx.moveTo(dividerX, panelY + padY * 0.65)
      ctx.lineTo(dividerX, panelY + panelHeight - padY * 0.65)
      ctx.strokeStyle = COLORS.headerDivider
      ctx.lineWidth = 1
      ctx.stroke()
    }

    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'

    ctx.font = `500 ${fontSize}px ${HEADER_FONT}`
    ctx.fillStyle = COLORS.headerLabel
    ctx.fillText(column.labelText, contentX, textY)

    const labelWidth = ctx.measureText(column.labelText).width + inlineGap

    ctx.font = `600 ${fontSize}px ${HEADER_FONT}`
    ctx.fillStyle = column.accent ? COLORS.headerValuePrimary : COLORS.headerValueSecondary
    ctx.fillText(column.value, contentX + labelWidth, textY)

    contentX += column.width + columnGap
  })
}

function isSectionModified(section, originSection) {
  if (!section || !originSection) return false
  return String(section) !== String(originSection)
}

function parseBeamThickness(section) {
  if (section == null || section === '') {
    return ''
  }

  const text = String(section)
  const index = text.toLowerCase().lastIndexOf('x')

  if (index === -1 || index === text.length - 1) {
    return ''
  }

  return text.slice(index + 1).trim()
}

function resolveThicknessLabelPosition(centerX, left, right, postXs, horizontalScale, verticalScale, beamY) {
  const hs = horizontalScale
  const vs = verticalScale
  const conflictThreshold = BASE.bracketWidth * hs * 0.8 + 12
  const baseY = beamY + (BASE.beamHeight * vs) / 2 + BASE.thicknessLabelGap * vs

  const hasConflict = (x) => postXs.some((postX) => Math.abs(postX - x) < conflictThreshold)

  if (!hasConflict(centerX)) {
    return { x: centerX, y: baseY }
  }

  const shift = conflictThreshold
  if (centerX + shift <= right - 6 && !hasConflict(centerX + shift)) {
    return { x: centerX + shift, y: baseY }
  }
  if (centerX - shift >= left + 6 && !hasConflict(centerX - shift)) {
    return { x: centerX - shift, y: baseY }
  }

  return {
    x: centerX,
    y: baseY + BASE.thicknessConflictOffsetY * vs
  }
}

function drawBeamThicknessLabels(ctx, beamList, postList, toX, beamY, horizontalScale, verticalScale) {
  if (!beamList || !beamList.length) {
    return
  }

  const hs = horizontalScale
  const vs = verticalScale
  const fontSize = Math.max(10, Math.round(BASE.thicknessFontSize * hs))
  const postXs = (postList || []).map((post) => toX(post.position))
  const sortedBeams = beamList
    .slice()
    .sort((a, b) => Number(a.start) - Number(b.start))

  ctx.fillStyle = COLORS.spanLabel
  ctx.font = `${fontSize}px Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  sortedBeams.forEach((beam) => {
    const thickness = parseBeamThickness(beam.section)
    if (!thickness) {
      return
    }

    const left = toX(beam.start)
    const right = toX(beam.end)
    if (right - left < fontSize * 1.2) {
      return
    }

    const centerX = (left + right) / 2
    const { x, y } = resolveThicknessLabelPosition(
      centerX,
      left,
      right,
      postXs,
      hs,
      vs,
      beamY
    )

    ctx.fillStyle = isSectionModified(beam.section, beam.origin_section)
      ? COLORS.modifiedSection
      : COLORS.spanLabel
    ctx.fillText(thickness, x, y)
  })
}

function drawSpanLabels(ctx, spans, toX, beamY, horizontalScale, verticalScale) {
  if (!spans.length) {
    return
  }

  const hs = horizontalScale
  const vs = verticalScale
  const fontSize = Math.max(10, Math.round(BASE.spanFontSize * hs))
  const labelY = beamY - (BASE.beamHeight * vs) / 2 - BASE.spanLabelGap * vs

  ctx.fillStyle = COLORS.spanLabel
  ctx.font = `${fontSize}px Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'

  spans.forEach((span) => {
    const centerX = (toX(span.start) + toX(span.end)) / 2
    ctx.fillText(String(Math.round(span.distance)), centerX, labelY)
  })
}

function drawBeamRatioLabels(ctx, ratioLabels, toX, beamY, horizontalScale, verticalScale) {
  if (!ratioLabels.length) {
    return
  }

  const hs = horizontalScale
  const vs = verticalScale
  const fontSize = Math.max(10, Math.round(BASE.beamRatioFontSize * hs))
  const labelY = getBeamRatioLabelY(beamY, hs, vs)

  ctx.font = `${fontSize}px Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  ratioLabels.forEach((label) => {
    const centerX = (toX(label.start) + toX(label.end)) / 2
    const ratio = label.ratio

    ctx.fillStyle = ratio > 0.9 ? COLORS.ratioHigh : COLORS.ratioNormal
    ctx.fillText(ratio.toFixed(2), centerX, labelY)
  })
}

function isDrivePost(post) {
  if (post.category === '驱动') {
    return true
  }

  const no = post.no != null ? String(post.no).trim() : ''
  return no !== '' && /^t/i.test(no)
}

function resolvePostColors(post) {
  if (isDrivePost(post)) {
    return {
      line: COLORS.drivePostLine,
      body: COLORS.drivePostBody,
      bracket: COLORS.drivePostBracket,
      bracketHighlight: COLORS.drivePostBracketHighlight
    }
  }

  return {
    line: COLORS.postLine,
    body: COLORS.postBody,
    bracket: COLORS.bracket,
    bracketHighlight: COLORS.bracketHighlight
  }
}

function drawPostBracket(ctx, x, beamY, horizontalScale, verticalScale, colors) {
  const width = BASE.bracketWidth * horizontalScale
  const height = BASE.bracketHeight * verticalScale
  const left = x - width / 2
  const top = beamY - height / 2

  ctx.fillStyle = colors.bracket
  ctx.fillRect(left, top, width, height)

  ctx.fillStyle = colors.bracketHighlight
  ctx.fillRect(left + width * 0.15, top + height * 0.15, width * 0.7, height * 0.25)
}

function buildPostLabelLines(post) {
  const firstLine =
    post.no != null && post.no !== ''
      ? String(post.no)
      : post.category != null
        ? String(post.category)
        : ''

  const lines = [
    { text: firstLine, color: COLORS.label },
    { text: post.material != null ? String(post.material) : '', color: COLORS.label },
    {
      text: post.section != null ? String(post.section) : '',
      color: isSectionModified(post.section, post.origin_section)
        ? COLORS.modifiedSection
        : COLORS.label
    }
  ]

  if (post.ratio != null && post.ratio !== '' && Number(post.ratio) >= 0) {
    const ratio = Number(post.ratio)
    lines.push({
      text: Number.isNaN(ratio) ? String(post.ratio) : ratio.toFixed(2),
      color: ratio > 0.9 ? COLORS.ratioHigh : COLORS.ratioNormal
    })
  }

  return lines
}

function resolvePileInfoColor(pileType) {
  switch (Number(pileType)) {
    case 0:
      return COLORS.pileInfoType0
    case 1:
      return COLORS.pileInfoType1
    case 2:
      return COLORS.pileInfoType2
    case 3:
      return COLORS.pileInfoType3
    default:
      return COLORS.pileInfoType0
  }
}

function buildPileInfoText(post) {
  const pileType = post.pile_type != null ? Number(post.pile_type) : NaN
  if (Number.isNaN(pileType)) {
    return ''
  }

  switch (pileType) {
    case 0: {
      let depth = post.pile_depth
      if (depth == null || depth === '') {
        depth = post.pile_obj && post.pile_obj.pile_depth != null
          ? post.pile_obj.pile_depth
          : ''
      }
      return depth !== '' && depth != null ? String(depth) : ''
    }
    case 1:
      return 'Bolt'
    case 2:
      return 'PHC'
    case 3:
      return 'SP'
    default:
      return ''
  }
}

function computePostPileInfoLabelPosition(post, x, beamY, hs, vs) {
  const text = buildPileInfoText(post)
  if (!text) {
    return null
  }

  const isDrive = isDrivePost(post)
  const postWidthRatio = isDrive ? BASE.drivePostWidthRatio : BASE.nonDrivePostWidthRatio
  const postWidth = BASE.postWidth * hs * postWidthRatio
  const mainBodyHeight = BASE.mainBodyHeight * vs
  const bottomLineHeight = BASE.bottomLineHeight * vs

  return {
    x: x + postWidth / 2 - 2 * hs + 2,
    y: beamY + mainBodyHeight + bottomLineHeight / 2,
    text
  }
}

function drawPostPileInfoLabel(ctx, post, layout) {
  const { x, beamY, horizontalScale, verticalScale, postWidth, mainBodyHeight, bottomLineHeight } = layout
  const hs = horizontalScale
  const vs = verticalScale
  const position = computePostPileInfoLabelPosition(post, x, beamY, hs, vs)
  if (!position) {
    return
  }

  const fontSize = Math.max(10, Math.round(BASE.fontSize * hs))

  ctx.font = `${fontSize}px Arial, sans-serif`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = resolvePileInfoColor(post.pile_type)
  ctx.fillText(position.text, position.x, position.y)
}

/**
 * 绘制单个立柱示意图元素
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} post post_info_lst 中的一项
 * @param {Object} layout { x, beamY, horizontalScale, verticalScale }
 */
export function drawPostElement(ctx, post, layout) {
  const { x, beamY, horizontalScale, verticalScale } = layout
  const hs = horizontalScale
  const vs = verticalScale
  const isDrive = isDrivePost(post)
  const postWidthRatio = isDrive ? BASE.drivePostWidthRatio : BASE.nonDrivePostWidthRatio
  const postWidth = BASE.postWidth * hs * postWidthRatio
  const mainBodyHeight = BASE.mainBodyHeight * vs
  const topLineHeight = BASE.topLineHeight * vs
  const bottomLineHeight = BASE.bottomLineHeight * vs
  const lineWidth = Math.max(1, BASE.lineWidth * hs)
  const colors = resolvePostColors(post)

  ctx.strokeStyle = colors.line
  ctx.lineWidth = isDrive ? lineWidth * 1.35 : lineWidth
  ctx.lineCap = 'round'

  ctx.beginPath()
  ctx.moveTo(x, beamY - topLineHeight)
  ctx.lineTo(x, beamY)
  ctx.stroke()

  ctx.fillStyle = colors.body
  ctx.fillRect(x - postWidth / 2, beamY, postWidth, mainBodyHeight)

  ctx.beginPath()
  ctx.moveTo(x, beamY + mainBodyHeight)
  ctx.lineTo(x, beamY + mainBodyHeight + bottomLineHeight)
  ctx.stroke()

  drawPostBracket(ctx, x, beamY, hs, vs, colors)

  drawPostPileInfoLabel(ctx, post, {
    x,
    beamY,
    horizontalScale: hs,
    verticalScale: vs,
    postWidth,
    mainBodyHeight,
    bottomLineHeight
  })

  const textStartY = beamY + mainBodyHeight + bottomLineHeight + BASE.textGap * vs
  const lineHeight = BASE.textLineHeight * vs
  const fontSize = Math.max(10, Math.round(BASE.fontSize * hs))
  const lines = buildPostLabelLines(post)

  ctx.font = `${fontSize}px Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  lines.forEach((line, index) => {
    ctx.fillStyle = line.color
    ctx.fillText(line.text, x, textStartY + index * lineHeight)
  })
}

/**
 * 绘制整张立柱示意图
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width 画布逻辑宽度
 * @param {number} height 画布逻辑高度
 * @param {Array} postList post_info_lst
 * @param {Object} options { horizontalScale, verticalScale, beamList, beamInfoLst1, beamSectionType, beamSectionDim, beamLength }
 */
export function drawTrackerPostDiagram(ctx, width, height, postList, options = {}) {
  const horizontalScale = options.horizontalScale != null ? options.horizontalScale : 1
  const verticalScale = options.verticalScale != null ? options.verticalScale : 1
  const beamList = options.beamList || []
  const beamInfoLst1 = options.beamInfoLst1
  const useBeamInfoLst1 = beamInfoLst1 != null && beamInfoLst1.length > 0
  const padding = BASE.padding

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = COLORS.background
  ctx.fillRect(0, 0, width, height)

  drawBeamHeader(ctx, options, horizontalScale)

  if (!postList || postList.length === 0) {
    ctx.fillStyle = '#909399'
    ctx.font = '13px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('暂无立柱数据', width / 2, height / 2)
    return
  }

  const beamY = BASE.beamY * verticalScale
  const toX = createLayoutMapper(postList, beamList, width, padding)

  if (beamList.length > 0) {
    drawBeamList(ctx, beamList, toX, beamY, horizontalScale, verticalScale)
  } else {
    drawFallbackBeam(ctx, postList, toX, beamY, horizontalScale, verticalScale, width, padding)
  }

  const spanLabels = useBeamInfoLst1
    ? buildSpanLabelsFromBeamInfoLst1(beamInfoLst1)
    : buildSpanLabels(postList, beamList)
  drawSpanLabels(ctx, spanLabels, toX, beamY, horizontalScale, verticalScale)
  drawBeamThicknessLabels(ctx, beamList, postList, toX, beamY, horizontalScale, verticalScale)

  if (useBeamInfoLst1) {
    drawBeamRatioLabels(
      ctx,
      buildBeamRatioLabels(beamInfoLst1),
      toX,
      beamY,
      horizontalScale,
      verticalScale
    )
  }

  postList.forEach((post) => {
    drawPostElement(ctx, post, {
      x: toX(post.position),
      beamY,
      horizontalScale,
      verticalScale
    })
  })
}

function computePostSectionLabelY(beamY, verticalScale) {
  const vs = verticalScale
  const mainBodyHeight = BASE.mainBodyHeight * vs
  const bottomLineHeight = BASE.bottomLineHeight * vs
  const textStartY = beamY + mainBodyHeight + bottomLineHeight + BASE.textGap * vs
  const lineHeight = BASE.textLineHeight * vs
  const sectionLineIndex = 2

  return textStartY + sectionLineIndex * lineHeight
}

/**
 * 计算示意图上立柱截面、主梁厚度编辑控件的位置（与 drawTrackerPostDiagram 布局一致）
 * @param {number} width 画布逻辑宽度
 * @param {Array} postList post_info_lst
 * @param {Object} options { horizontalScale, verticalScale, beamList }
 * @returns {{ postOverlays: Array, beamOverlays: Array, pileOverlays: Array, beamHitOverlays: Array }}
 */
export function computeDiagramEditOverlays(width, postList, options = {}) {
  const horizontalScale = options.horizontalScale != null ? options.horizontalScale : 1
  const verticalScale = options.verticalScale != null ? options.verticalScale : 1
  const beamList = options.beamList || []
  const padding = BASE.padding
  const hs = horizontalScale
  const vs = verticalScale
  const beamY = BASE.beamY * vs
  const toX = createLayoutMapper(postList, beamList, width, padding)
  const postXs = (postList || []).map((post) => toX(post.position))
  const postSectionY = computePostSectionLabelY(beamY, vs)

  const postOverlays = (postList || []).map((post) => ({
    post,
    x: toX(post.position),
    y: postSectionY,
    key: String(post.position)
  }))

  const beamOverlays = []
  const sortedBeams = beamList
    .slice()
    .sort((a, b) => Number(a.start) - Number(b.start))

  sortedBeams.forEach((beam, index) => {
    const thickness = parseBeamThickness(beam.section)
    if (!thickness) {
      return
    }

    const left = toX(beam.start)
    const right = toX(beam.end)
    const centerX = (left + right) / 2
    const { x, y } = resolveThicknessLabelPosition(
      centerX,
      left,
      right,
      postXs,
      hs,
      vs,
      beamY
    )

    beamOverlays.push({
      beam,
      x,
      y,
      key: `${beam.start}-${beam.end}-${index}`
    })
  })

  const pileOverlays = []
  ;(postList || []).forEach((post) => {
    const position = computePostPileInfoLabelPosition(post, toX(post.position), beamY, hs, vs)
    if (!position) {
      return
    }
    pileOverlays.push({
      post,
      x: position.x,
      y: position.y,
      text: position.text,
      key: String(post.position)
    })
  })

  const beamHeight = BASE.beamHeight * vs
  const beamHitOverlays = sortedBeams.map((beam, index) => {
    const left = toX(beam.start)
    const right = toX(beam.end)
    return {
      beam,
      left,
      top: beamY - beamHeight / 2,
      width: Math.max(0, right - left),
      height: beamHeight,
      key: `beam-hit-${beam.start}-${beam.end}-${index}`
    }
  }).filter((item) => item.width > 0)

  return { postOverlays, beamOverlays, pileOverlays, beamHitOverlays }
}

export {
  BASE as POST_DRAW_BASE,
  BEAM_COLOR_SETS,
  parseBeamThickness,
  buildBeamTypeText,
  buildPileInfoText,
  resolveBeamMaterial
}
