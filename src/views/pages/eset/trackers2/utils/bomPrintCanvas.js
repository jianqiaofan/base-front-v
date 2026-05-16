/**
 * 使用 Canvas 绘制 BOM 表格并导出为多页 A4 PDF（竖向）
 */
import JsPDF from 'jspdf'

const A4_W_MM = 210
const A4_H_MM = 297
const MARGIN_MM = 12
const USABLE_W_MM = A4_W_MM - MARGIN_MM * 2

function mmToPx(mm) {
  return (mm * 96) / 25.4
}

/** 绿色环保 + 科技感 */
const COLORS = {
  headerTop: '#10b981',
  headerMid: '#059669',
  headerBottom: '#047857',
  headerText: '#ecfdf5',
  headerAccentLine: '#5eead4',
  border: 'rgba(16, 185, 129, 0.42)',
  borderStrong: 'rgba(20, 184, 166, 0.55)',
  zebraA: '#f0fdf4',
  zebraB: '#ecfdf5',
  text: '#064e3b',
  titleText: '#065f46',
  rowAccent: '#22d3ee',
  rowAccentEnd: '#14b8a6',
  pageBgTop: '#f8fffc',
  pageBgBottom: '#f0fdf4',
  dotGrid: 'rgba(16, 185, 129, 0.07)',
  frameOuter: 'rgba(52, 211, 153, 0.65)',
  titleGradientA: '#ecfdf5',
  titleGradientB: '#d1fae5',
  titleGradientC: '#a7f3d0',
  titleStroke: '#34d399',
  titleInnerStroke: 'rgba(94, 234, 212, 0.55)',
  cornerBracket: '#14b8a6'
}

function roundRectPath(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rad, y)
  ctx.lineTo(x + w - rad, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad)
  ctx.lineTo(x + w, y + h - rad)
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h)
  ctx.lineTo(x + rad, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad)
  ctx.lineTo(x, y + rad)
  ctx.quadraticCurveTo(x, y, x + rad, y)
  ctx.closePath()
}

function drawEcoTechPageBg(ctx, widthPx, totalH) {
  const bg = ctx.createLinearGradient(0, 0, widthPx, totalH)
  bg.addColorStop(0, COLORS.pageBgTop)
  bg.addColorStop(1, COLORS.pageBgBottom)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, widthPx, totalH)

  ctx.fillStyle = COLORS.dotGrid
  for (let px = 0; px < widthPx; px += 22) {
    for (let py = 0; py < totalH; py += 22) {
      ctx.fillRect(px, py, 1.2, 1.2)
    }
  }

  const glow = ctx.createLinearGradient(0, 0, widthPx, 0)
  glow.addColorStop(0, 'rgba(52, 211, 153, 0)')
  glow.addColorStop(0.5, 'rgba(94, 234, 212, 0.06)')
  glow.addColorStop(1, 'rgba(52, 211, 153, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, widthPx, Math.min(120, totalH))
}

function drawTechCorners(ctx, x, y, w, h, color, arm = 10) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.lineCap = 'square'
  ctx.beginPath()
  ctx.moveTo(x, y + arm)
  ctx.lineTo(x, y)
  ctx.lineTo(x + arm, y)
  ctx.moveTo(x + w - arm, y)
  ctx.lineTo(x + w, y)
  ctx.lineTo(x + w, y + arm)
  ctx.moveTo(x + w, y + h - arm)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x + w - arm, y + h)
  ctx.moveTo(x + arm, y + h)
  ctx.lineTo(x, y + h)
  ctx.lineTo(x, y + h - arm)
  ctx.stroke()
}

function wrapText(ctx, text, maxWidth) {
  const s = String(text ?? '')
  if (!s) {
    return ['']
  }
  const lines = []
  let line = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    const test = line + ch
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = ch
    } else {
      line = test
    }
  }
  if (line) {
    lines.push(line)
  }
  return lines.length ? lines : ['']
}

function computeLayouts(ctx, rows, colWidthsPx, lineHeight) {
  const padX = 6
  return rows.map((cells) => {
    let maxLines = 1
    const cellLines = cells.map((text, i) => {
      const maxW = Math.max(16, colWidthsPx[i] - padX * 2)
      const lines = wrapText(ctx, text, maxW)
      maxLines = Math.max(maxLines, lines.length)
      return lines
    })
    const rowH = Math.max(28, maxLines * lineHeight + 14)
    return { cellLines, height: rowH }
  })
}

function measureTitleBlockPx(title, widthPx, englishFont) {
  const titleSize = 17
  const padY = 11
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  ctx.font = englishFont
    ? `600 ${titleSize}px "Segoe UI","Helvetica Neue",Arial,sans-serif`
    : `600 ${titleSize}px "Microsoft YaHei","PingFang SC","Segoe UI",sans-serif`
  const boxH = titleSize + padY * 2
  return 12 + boxH + 22
}

function paginateLayouts(layouts, firstPageBodyMax, otherPageBodyMax) {
  if (!layouts.length) {
    return [[]]
  }
  const pages = []
  let rest = layouts
  let isFirst = true

  while (rest.length) {
    const maxH = isFirst ? firstPageBodyMax : otherPageBodyMax
    const slice = []
    let h = 0
    for (let i = 0; i < rest.length; i++) {
      const layout = rest[i]
      if (slice.length && h + layout.height > maxH) {
        break
      }
      slice.push(layout)
      h += layout.height
    }
    pages.push(slice)
    rest = rest.slice(slice.length)
    isFirst = false
  }
  return pages
}

function drawRoundedTitle(ctx, title, widthPx, yStart, englishFont) {
  const titleSize = 17
  ctx.font = englishFont
    ? `600 ${titleSize}px "Segoe UI","Helvetica Neue",Arial,sans-serif`
    : `600 ${titleSize}px "Microsoft YaHei","PingFang SC","Segoe UI",sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  const tw = ctx.measureText(title).width
  const padX = 22
  const padY = 11
  const boxW = Math.min(tw + padX * 2, widthPx - 28)
  const boxH = titleSize + padY * 2
  const x = (widthPx - boxW) / 2
  const r = 8

  const grd = ctx.createLinearGradient(x, yStart, x + boxW, yStart + boxH)
  grd.addColorStop(0, COLORS.titleGradientA)
  grd.addColorStop(0.45, COLORS.titleGradientB)
  grd.addColorStop(1, COLORS.titleGradientC)
  ctx.fillStyle = grd
  roundRectPath(ctx, x, yStart, boxW, boxH, r)
  ctx.fill()

  ctx.strokeStyle = COLORS.titleStroke
  ctx.lineWidth = 1.25
  roundRectPath(ctx, x, yStart, boxW, boxH, r)
  ctx.stroke()

  ctx.strokeStyle = COLORS.titleInnerStroke
  ctx.lineWidth = 0.75
  roundRectPath(ctx, x + 2.5, yStart + 2.5, boxW - 5, boxH - 5, r - 2)
  ctx.stroke()

  drawTechCorners(ctx, x - 1, yStart - 1, boxW + 2, boxH + 2, COLORS.cornerBracket, 11)

  ctx.fillStyle = COLORS.titleText
  ctx.fillText(title, widthPx / 2, yStart + padY + 0.5)

  const lineY = yStart + boxH + 5
  const ln = ctx.createLinearGradient(x, lineY, x + boxW, lineY)
  ln.addColorStop(0, 'rgba(52, 211, 153, 0)')
  ln.addColorStop(0.5, 'rgba(45, 212, 191, 0.75)')
  ln.addColorStop(1, 'rgba(52, 211, 153, 0)')
  ctx.strokeStyle = ln
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x + 8, lineY)
  ctx.lineTo(x + boxW - 8, lineY)
  ctx.stroke()

  ctx.textAlign = 'left'
  return boxH + 22
}

function drawHeaderRow(ctx, titles, colWidthsPx, y, height, widthPx, englishFont) {
  const hg = ctx.createLinearGradient(0, y, 0, y + height)
  hg.addColorStop(0, COLORS.headerTop)
  hg.addColorStop(0.5, COLORS.headerMid)
  hg.addColorStop(1, COLORS.headerBottom)
  ctx.fillStyle = hg
  ctx.fillRect(0, y, widthPx, height)

  ctx.strokeStyle = COLORS.headerAccentLine
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, y + 1.5)
  ctx.lineTo(widthPx, y + 1.5)
  ctx.stroke()

  ctx.strokeStyle = COLORS.borderStrong
  ctx.lineWidth = 1
  ctx.font = englishFont
    ? '600 10px "Segoe UI","Helvetica Neue",Arial,sans-serif'
    : '600 11px "Microsoft YaHei","PingFang SC","Segoe UI",sans-serif'
  ctx.fillStyle = COLORS.headerText
  ctx.textBaseline = 'middle'
  let x = 0
  titles.forEach((t, i) => {
    ctx.strokeRect(x, y, colWidthsPx[i], height)
    ctx.fillText(t, x + 7, y + height / 2)
    x += colWidthsPx[i]
  })
  ctx.textBaseline = 'alphabetic'

  ctx.strokeStyle = COLORS.headerAccentLine
  ctx.globalAlpha = 0.45
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, y + height - 0.5)
  ctx.lineTo(widthPx, y + height - 0.5)
  ctx.stroke()
  ctx.globalAlpha = 1
}

function drawBodyRow(ctx, layout, colWidthsPx, y, widthPx, rowIndex, lineHeight, englishFont) {
  const { cellLines, height } = layout
  const bg = rowIndex % 2 === 0 ? COLORS.zebraA : COLORS.zebraB
  ctx.fillStyle = bg
  ctx.fillRect(0, y, widthPx, height)

  const stripe = ctx.createLinearGradient(0, y, 4, y + height)
  stripe.addColorStop(0, COLORS.rowAccent)
  stripe.addColorStop(1, COLORS.rowAccentEnd)
  ctx.fillStyle = stripe
  ctx.fillRect(0, y, 3.5, height)

  ctx.strokeStyle = COLORS.border
  ctx.lineWidth = 1
  ctx.font = englishFont
    ? `400 10px "Segoe UI","Helvetica Neue",Arial,sans-serif`
    : `400 11px "Microsoft YaHei","PingFang SC","Segoe UI",sans-serif`
  ctx.fillStyle = COLORS.text
  ctx.textBaseline = 'middle'

  let x = 0
  cellLines.forEach((lines, i) => {
    const cw = colWidthsPx[i]
    ctx.strokeRect(x, y, cw, height)
    const blockH = lines.length * lineHeight
    const top = y + Math.max(0, (height - blockH) / 2)
    lines.forEach((line, li) => {
      const cy = top + li * lineHeight + lineHeight / 2
      ctx.fillText(line, x + 8, cy)
    })
    x += cw
  })
  ctx.textBaseline = 'alphabetic'
}

function renderPageCanvas({
  title,
  columnTitles,
  pageLayouts,
  colFractions,
  widthPx,
  lineHeight,
  showTitle,
  englishFont
}) {
  const headerH = 34
  const titleBlockPx = showTitle ? measureTitleBlockPx(title, widthPx, englishFont) : 18
  const bodyH = pageLayouts.reduce((s, l) => s + l.height, 0)
  const totalH = titleBlockPx + headerH + bodyH + 22

  const canvas = document.createElement('canvas')
  const dpr = Math.min(2, window.devicePixelRatio || 2)
  canvas.width = widthPx * dpr
  canvas.height = totalH * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  drawEcoTechPageBg(ctx, widthPx, totalH)

  let y = 12
  if (showTitle) {
    y += drawRoundedTitle(ctx, title, widthPx, y, englishFont)
  } else {
    y += 6
  }

  const fractions = [...colFractions]
  const sum = fractions.reduce((a, b) => a + b, 0)
  const norm = fractions.map((f) => f / sum)
  let colWidthsPx = norm.map((f) => Math.floor(f * widthPx))
  const drift = widthPx - colWidthsPx.reduce((a, b) => a + b, 0)
  colWidthsPx[colWidthsPx.length - 1] += drift

  const tableTopY = y
  drawHeaderRow(ctx, columnTitles, colWidthsPx, y, headerH, widthPx, englishFont)
  y += headerH

  pageLayouts.forEach((layout, idx) => {
    drawBodyRow(ctx, layout, colWidthsPx, y, widthPx, idx, lineHeight, englishFont)
    y += layout.height
  })

  const tableBottomY = y
  ctx.save()
  ctx.strokeStyle = COLORS.frameOuter
  ctx.lineWidth = 1.75
  roundRectPath(ctx, 1.5, tableTopY - 2, widthPx - 3, tableBottomY - tableTopY + 4, 6)
  ctx.stroke()
  const innerGlow = ctx.createLinearGradient(0, tableTopY, 0, tableBottomY)
  innerGlow.addColorStop(0, 'rgba(45, 212, 191, 0.12)')
  innerGlow.addColorStop(1, 'rgba(52, 211, 153, 0.05)')
  ctx.strokeStyle = innerGlow
  ctx.lineWidth = 0.75
  roundRectPath(ctx, 3, tableTopY, widthPx - 6, tableBottomY - tableTopY, 5)
  ctx.stroke()
  ctx.restore()

  return { canvas, heightPx: totalH }
}

/**
 * @param {object} params
 * @param {string} params.fileName
 * @param {string} params.title
 * @param {string[]} params.columnTitles
 * @param {number[]} params.colFractions
 * @param {string[][]} params.rows
 * @param {boolean} [params.englishFont]
 */
export function exportBomPdfFromCanvas(params) {
  const {
    fileName,
    title,
    columnTitles,
    colFractions,
    rows,
    englishFont = false
  } = params

  const widthPx = Math.round(mmToPx(USABLE_W_MM))
  const lineHeight = englishFont ? 12 : 13

  const canvasMeasure = document.createElement('canvas')
  canvasMeasure.width = widthPx
  canvasMeasure.height = 40
  const mctx = canvasMeasure.getContext('2d')
  mctx.font = englishFont
    ? '400 10px "Segoe UI","Helvetica Neue",Arial,sans-serif'
    : '400 11px "Microsoft YaHei","PingFang SC",sans-serif'

  const sumFr = colFractions.reduce((a, b) => a + b, 0)
  const normFr = colFractions.map((f) => f / sumFr)
  let colWidthsPx = normFr.map((f) => Math.floor(f * widthPx))
  colWidthsPx[colWidthsPx.length - 1] += widthPx - colWidthsPx.reduce((a, b) => a + b, 0)

  let dataRows = rows
  if (!dataRows.length) {
    const emptyRow = columnTitles.map((_, i) => (i === 0 ? (englishFont ? 'No data' : '暂无数据') : ''))
    dataRows = [emptyRow]
  }

  const layouts = computeLayouts(mctx, dataRows, colWidthsPx, lineHeight)

  const usablePxH = mmToPx(A4_H_MM - MARGIN_MM * 2)
  const headerH = 34
  const titleReservePx = measureTitleBlockPx(title, widthPx, englishFont)
  const firstBodyMax = usablePxH - titleReservePx - headerH - 10
  const otherBodyMax = usablePxH - headerH - 28

  const pages = paginateLayouts(layouts, firstBodyMax, otherBodyMax)

  const pdf = new JsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const imgWidthMm = USABLE_W_MM
  const maxImgHmm = A4_H_MM - MARGIN_MM * 2

  pages.forEach((pageLayouts, pi) => {
    if (pi > 0) {
      pdf.addPage()
    }
    const showTitle = pi === 0
    const { canvas, heightPx } = renderPageCanvas({
      title,
      columnTitles,
      pageLayouts,
      colFractions: normFr,
      widthPx,
      lineHeight,
      showTitle,
      englishFont
    })

    let imgHeightMm = (heightPx / widthPx) * imgWidthMm
    let imgWidthMmFit = imgWidthMm
    if (imgHeightMm > maxImgHmm) {
      const scale = maxImgHmm / imgHeightMm
      imgHeightMm = maxImgHmm
      imgWidthMmFit = imgWidthMm * scale
    }
    const imgData = canvas.toDataURL('image/png', 1.0)
    const xMm = MARGIN_MM + (imgWidthMm - imgWidthMmFit) / 2
    pdf.addImage(imgData, 'PNG', xMm, MARGIN_MM, imgWidthMmFit, imgHeightMm)
  })

  pdf.save(fileName)
}
