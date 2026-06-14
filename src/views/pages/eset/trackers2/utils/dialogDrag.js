/**
 * 为 Element UI Dialog 绑定标题栏拖拽
 * @param {HTMLElement} dragDom .el-dialog 元素
 * @returns {Function} 解绑函数
 */
export function bindDialogDrag(dragDom) {
  if (!dragDom) {
    return () => {}
  }

  const header = dragDom.querySelector('.el-dialog__header')
  if (!header) {
    return () => {}
  }

  header.style.cursor = 'move'

  const onMouseDown = (event) => {
    if (event.button !== 0) {
      return
    }
    if (event.target.closest('.el-dialog__headerbtn')) {
      return
    }

    event.preventDefault()

    const rect = dragDom.getBoundingClientRect()
    const startX = event.clientX
    const startY = event.clientY
    const originLeft = rect.left
    const originTop = rect.top

    dragDom.style.position = 'absolute'
    dragDom.style.margin = '0'
    dragDom.style.left = `${originLeft}px`
    dragDom.style.top = `${originTop}px`

    const onMouseMove = (moveEvent) => {
      dragDom.style.left = `${originLeft + moveEvent.clientX - startX}px`
      dragDom.style.top = `${originTop + moveEvent.clientY - startY}px`
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  header.addEventListener('mousedown', onMouseDown)

  return () => {
    header.removeEventListener('mousedown', onMouseDown)
    header.style.cursor = ''
  }
}

export function resetDialogPosition(dragDom) {
  if (!dragDom) {
    return
  }
  dragDom.style.position = ''
  dragDom.style.margin = ''
  dragDom.style.left = ''
  dragDom.style.top = ''
}

export function findDialogByClass(className) {
  const dialogs = document.getElementsByClassName(className)
  if (!dialogs.length) {
    return null
  }
  return dialogs[dialogs.length - 1]
}
