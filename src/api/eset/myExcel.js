import ExcelJS from 'exceljs'
import continuousView from 'echarts/src/component/visualMap/ContinuousView'
import de from 'element-ui/src/locale/lang/de'

export default {
  //获取excel文件
  async getWorkbook(file) {
    if (!file) return null
    try {
      const workbook = new ExcelJS.Workbook()
      const arrayBuffer = await file.arrayBuffer() // 直接读 ArrayBuffer，省事儿
      await workbook.xlsx.load(arrayBuffer)
      return workbook
    } catch (error) {
      console.error('用 ExcelJS 解析失败了，检查下文件？', error)
      alert('文件好像有点问题，解析不了哦，提示：只能读xslx文件，文件不能被压缩或被加密')
    }
  },

  /**
   * 获取excel文件全部工作簿名
   * @param file
   */
  getExcelWorksheetNames(workbook) {
    let workSheetName = []
    workbook.eachSheet(function(worksheet, sheetId) {
      workSheetName.push(worksheet._name)
    })
    return workSheetName
  },

  /**
   * 通过工作表序号或工作表名称，返回workbook对象的某个工作表对象
   * @param workbook
   * @param sheetIndexOrName
   */
  getSheetObj(workbook, sheetIndexOrName) {
      const worksheet = workbook.getWorksheet(sheetIndexOrName) // 获取第一个 worksheet
      return worksheet // 返回工作表对象
  },

  /**
   * 根据内容,在工作表中找满足内容的第1个地址
   * @param worksheet 要查找的工作表对象
   * @param findContent 查找的内容 (如果是数组，则数组每一项都包含才算找到)
   * @param startSearchRow 从第几行开始扫描,默认时从0开始
   * @param endSearchRow 扫描到第几行结束,默认时从扫到最后一个有效行
   * @param startSearchCol 从第几列开始扫描,默认时从0开始
   * @param endSearchCol 扫描到第几列结束,默认时从扫到最后一个有效列
   * @returns {string}
   */
  getCellAddressByValue(worksheet, findContent, startSearchRow, endSearchRow, startSearchCol, endSearchCol) {
    const nLastRow = worksheet._rows.length  //最后一个有效行行号
    //如果第一个可选参数未输入，则后面全部用默认值
    if (startSearchRow === undefined || typeof (startSearchRow) !== 'number' || startSearchCol < 1) {
      startSearchRow = 1
      endSearchRow = nLastRow
      startSearchCol = 1
      endSearchCol = 26
    } else if (endSearchRow === undefined || typeof (endSearchRow) !== 'number' || endSearchRow < 1) {
      endSearchRow = nLastRow
      startSearchCol = 1
      endSearchCol = 26
    } else if (startSearchCol === undefined || typeof (startSearchCol) !== 'number' || startSearchCol < 1) {
      startSearchCol = 1
      endSearchCol = 26
    } else if (endSearchCol === undefined || typeof (endSearchCol) !== 'number' || endSearchCol < 1) {
      endSearchCol = 26
    }
    //限制最大值
    startSearchRow = Math.min(startSearchRow, nLastRow)
    endSearchRow = Math.min(endSearchRow, nLastRow)
    startSearchCol = Math.min(startSearchCol, 100)
    endSearchCol = Math.min(endSearchCol, 100)

    for (let i = startSearchRow; i < endSearchRow; i++) {
      const row = worksheet.getRow(i)
      for (let j = startSearchCol; j < endSearchCol + 1 && j < row._cells.length; j++) {
        let cellVal = ''
        if (row._cells[j]) {
          if (row._cells[j]._value.model.value === undefined) {
            cellVal = row._cells[j]._value.model.result
            // console.log(j + '列:', row._cells[j]._value.model.result)
          } else {
            cellVal = row._cells[j]._value.model.value
            // console.log(j + '列:', row._cells[j]._value.model.value)
          }
        }
        if (cellVal !== undefined) {
          if (Array.isArray(findContent)) {
            if (findContent.every(item => cellVal.toString().includes(item))) {
              return row._cells[j]._address
            }
          } else {
            if (cellVal === findContent) {
              return row._cells[j]._address
            }
          }
        }
      }
    }
    return undefined
  },

  /**
   * 根据一个内容或内容数组，找到偏移行数和偏移列数后的另一个值。
   * @param worksheet 工作表
   * @param findContent 要找到值
   * @param rowOffset 行偏移，默认为0，即本行
   * @param colOffset 列偏移，默认为1，即查找值的右边一个单元格
   * 以下是缩小查找范围的参数，可选
   * @param startSearchRow
   * @param endSearchRow
   * @param startSearchCol
   * @param endSearchCol
   */
  getOffsetValue(worksheet, findContent, rowOffset, colOffset, startSearchRow, endSearchRow, startSearchCol, endSearchCol) {
    if (rowOffset === undefined || typeof (rowOffset) !== 'number' || rowOffset < 1) {
      rowOffset = 0
    }
    if (colOffset === undefined || typeof (colOffset) !== 'number' || colOffset < 1) {
      colOffset = 1
    }
    //startSearchRow, endSearchRow, startSearchCol, endSearchCol参数这里不需要再进行处理，因为getCellAddressByValue处理得很好了
    let address = this.getCellAddressByValue(worksheet, findContent, startSearchRow, endSearchRow, startSearchCol, endSearchCol)
    if (address !== undefined) {
      let [r, c] = this.coverAddress2Number(address)
      const cell = worksheet.getCell(r + rowOffset, c + colOffset)
      if (cell._value.model.value === undefined) {
        return cell._value.model.result
      } else {
        return cell._value.model.value
      }
    }
    return undefined
  },

  /**
   * 找出cell对象的值
   * @param cell 单元格对象
   * @returns {*}
   */
  getValueByCell(cell) {
    if (cell._value.model.value === undefined) {
      return cell._value.model.result
    } else {
      return cell._value.model.value
    }
  },

  /**
   * 根据单位格地址找单位格的值
   * @param worksheet 要查找的工作表对象
   * @param address 单元格地址
   * @param address
   * @returns {*}
   */
  getCellValueByAddress(worksheet, address) {
    let cellVal = ''
    let cell = worksheet.getCell(address)
    if (cell._value.model.value === undefined) {
      cellVal = cell._value.model.result
    } else {
      cellVal = cell._value.model.value
    }
    return cellVal
  },

  /**
   * 将Excel单位格地址字符串转为行号和列号数组
   * @param addStr //Excel单位格地址字符串
   * @returns {*[row,col]}
   */
  coverAddress2Number(addStr) {
    const regex = new RegExp('^[A-Z]{1,2}[0-9]+$')
    if (!regex.test(addStr)) {
      return undefined
    }
    let numPos = 0//数字开始的位置下标
    for (let i = 0; i < addStr.length; i++) {
      if (addStr.charCodeAt(i) > 47 && addStr.charCodeAt(i) < 58) {
        //数字ASCII码范围在48-57之间
        numPos = i
        break
      }
    }
    let rowNum = +addStr.slice(numPos)  //行号
    let colNum
    if (numPos === 1) {
      colNum = +addStr.slice(0, numPos).charCodeAt() - 64
    } else if (numPos === 2) {
      colNum = (+addStr.slice(1, numPos).charCodeAt() - 64) * 26 + (addStr.slice(0, numPos).charCodeAt() - 64)
    } else {
      throw new Error('输入的单元格地址非法')
    }
    return [rowNum, colNum]
  }

}
