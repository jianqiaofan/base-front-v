import myExcel from '@/api/eset/myExcel'

export class ProjectBom {
  constructor(worksheet) {
    //找出主材料表和辅材表位置
    this.sheetName = worksheet._name  //工作表名
    this.projectCode = ''
    this.project = myExcel.getOffsetValue(worksheet, ['工', '程', '名', '称', 'Project'], 0, 1, 2, 10, 1, 5)
    this.orderNo = myExcel.getOffsetValue(worksheet, ['订', '单', '号', 'Order', 'No'], 0, 1, 2, 10, 1, 5)//订单号
    this.batch = myExcel.getOffsetValue(worksheet, ['批', '次', 'Batch'], 0, 1, 2, 10, 1, 5)//批次
    this.orderSets = myExcel.getOffsetValue(worksheet, ['订', '单', '套', '数', 'Order', 'Sets'], 0, 1, 2, 10, 1, 5)//订单套数

    this.productType = myExcel.getOffsetValue(worksheet, ['产品', '型号', 'Product', 'Type'], 0, 1, 2, 10, 1, 26)//产品型号
    this.stage = myExcel.getOffsetValue(worksheet, ['阶', '段', 'Stage'], 0, 1, 2, 10, 1, 26)//阶段
    this.capacity = myExcel.getOffsetValue(worksheet, ['容', '量', 'Capacity'], 0, 1, 2, 10, 1, 26)//容量
    this.shippingSets = myExcel.getOffsetValue(worksheet, ['发货', '套数', 'Shipping', 'Sets'], 0, 1, 2, 10, 1, 26)//发货套数

    this.rows = myExcel.getOffsetValue(worksheet, ['行', '数', 'Rows'], 0, 2, 2, 10, 1, 26)//行数
    this.columns = myExcel.getOffsetValue(worksheet, ['列', '数', 'Columns'], 0, 2, 2, 10, 1, 26)//列数
    this.modulePower = myExcel.getOffsetValue(worksheet, ['组件', '功率', 'Module', 'Power'], 0, 2, 2, 10, 1, 26)//组件功率

    this.tilt = myExcel.getOffsetValue(worksheet, ['倾角', '坡度',  'Tilt'], 0, 2, 2, 10, 1, 26)//倾角坡度
    this.modulePlacement = myExcel.getOffsetValue(worksheet, ['组件', '布向', 'Module', 'Placement'], 0, 2, 2, 10, 1, 26)//组件布向
    this.structureType = myExcel.getOffsetValue(worksheet, ['支架', '类型', 'Structure', 'Type'], 0, 2, 2, 10, 1, 26)//支架类型
    this.moduleSize = myExcel.getOffsetValue(worksheet, ['组件', '尺寸', 'Module', 'Size'], 0, 2, 2, 10, 1, 26)//组件尺寸

    this.structurePcs = myExcel.getOffsetValue(worksheet, ['单套榀数', 'Structure', 'Pcs'], 0, 1, 2, 10, 1, 26)//单套榀数
    this.baseQty = myExcel.getOffsetValue(worksheet, ['基础单数','Base', 'Qty'], 0, 1, 2, 10, 1, 26)//基础单数
    this.columnBase = myExcel.getOffsetValue(worksheet, ['柱脚形式', 'Column', 'Base'], 0, 1, 2, 10, 1, 26)//柱脚形式
    this.baseType = myExcel.getOffsetValue(worksheet, ['基础类型', 'Base', 'Type'], 0, 1, 2, 10, 1, 26)//基础类型

    const sta1 = myExcel.coverAddress2Number(myExcel.getCellAddressByValue(worksheet,['序号','No'],5,8,2,4))  //主材表起始位置
    const sta2 = myExcel.coverAddress2Number(myExcel.getCellAddressByValue(worksheet,['序号','No'],sta1[0]+2,100,2,4)) //辅表起始位置
    const end1 = myExcel.coverAddress2Number(myExcel.getCellAddressByValue(worksheet,['合计','Subtotal'],5,100,2,4))  //主材表终点位置
    const end2 = myExcel.coverAddress2Number(myExcel.getCellAddressByValue(worksheet,['合计','Subtotal'],end1[0]+2,1000,2,4)) //辅表终点位置
    let table1=[]
    for (let i = sta1[0]+1; i < end1[0]; i++) {
      // table1.push(new MainMaterial(worksheet,8,3))
      table1.push(new MainMaterial(worksheet,i,sta1[1]))
    }
    let table2=[]
    for (let i = sta2[0]+1; i < end2[0]; i++) {
      table2.push(new FastenersAndAccessories(worksheet,i,sta2[1]))
    }
    this.mainMaterials = table1  //主材料清单
    this.fastenersAndAccessories = table2  //螺栓配件
  }
}

class MainMaterial {
  constructor(worksheet,row,startCol) {
    this.num = myExcel.getValueByCell(worksheet.getCell(row, startCol+0))
    this.name = myExcel.getValueByCell(worksheet.getCell(row, startCol+1))
    this.partNum = myExcel.getValueByCell(worksheet.getCell(row, startCol+2))
    this.model = myExcel.getValueByCell(worksheet.getCell(row, startCol+3))
    this.lenth = myExcel.getValueByCell(worksheet.getCell(row, startCol+4))
    this.unit = myExcel.getValueByCell(worksheet.getCell(row, startCol+5))
    this.unitQty = myExcel.getValueByCell(worksheet.getCell(row, startCol+6))
    this.totalQty = myExcel.getValueByCell(worksheet.getCell(row, startCol+7))
    this.spareQty = myExcel.getValueByCell(worksheet.getCell(row, startCol+8))
    this.spareRatio = myExcel.getValueByCell(worksheet.getCell(row, startCol+9))
    this.actualQty = myExcel.getValueByCell(worksheet.getCell(row, startCol+10))
    this.mass = myExcel.getValueByCell(worksheet.getCell(row, startCol+11))
    this.unitWeight = myExcel.getValueByCell(worksheet.getCell(row, startCol+12))
    this.totalWeight = myExcel.getValueByCell(worksheet.getCell(row, startCol+13))
    this.material = myExcel.getValueByCell(worksheet.getCell(row, startCol+14))
    this.remarks = myExcel.getValueByCell(worksheet.getCell(row, startCol+15))

    this.dispatchPlace = ''
    this.rawPrice = ''
    this.processFee = ''
    this.galvanizedFee = ''
    this.packageFee = ''
    this.packageBoxFee = ''
    this.comprehensivePrice = ''
    this.totalPrice = ''
    this.priceRemark = ''

    //报价信息
    // this.dispatchPlace = myExcel.getValueByCell(worksheet.getCell(row, startCol+16))
    // this.rawPrice = myExcel.getValueByCell(worksheet.getCell(row, startCol+17))
    // this.processFee = myExcel.getValueByCell(worksheet.getCell(row, startCol+18))
    // this.galvanizedFee = myExcel.getValueByCell(worksheet.getCell(row, startCol+19))
    // this.packageFee = myExcel.getValueByCell(worksheet.getCell(row, startCol+20))
    // this.packageBoxFee = myExcel.getValueByCell(worksheet.getCell(row, startCol+21))
    // this.comprehensivePrice = myExcel.getValueByCell(worksheet.getCell(row, startCol+22))
    // this.totalPrice = myExcel.getValueByCell(worksheet.getCell(row, startCol+23))
    // this.priceRemark = myExcel.getValueByCell(worksheet.getCell(row, startCol+24))
  }
}

class FastenersAndAccessories {
  constructor(worksheet,row,startCol) {
    this.num = myExcel.getValueByCell(worksheet.getCell(row, startCol+0))
    this.joint = myExcel.getValueByCell(worksheet.getCell(row, startCol+1))
    this.type = myExcel.getValueByCell(worksheet.getCell(row, startCol+2))
    this.model = myExcel.getValueByCell(worksheet.getCell(row, startCol+3))
    this.attachment = myExcel.getValueByCell(worksheet.getCell(row, startCol+4))
    this.unit = myExcel.getValueByCell(worksheet.getCell(row, startCol+5))
    this.unitQty = myExcel.getValueByCell(worksheet.getCell(row, startCol+6))
    this.totalQty = myExcel.getValueByCell(worksheet.getCell(row, startCol+7))
    this.spareQty = myExcel.getValueByCell(worksheet.getCell(row, startCol+8))
    this.spareRatio = myExcel.getValueByCell(worksheet.getCell(row, startCol+9))
    this.actualQty = myExcel.getValueByCell(worksheet.getCell(row, startCol+10))
    this.unitWeight = myExcel.getValueByCell(worksheet.getCell(row, startCol+11))  //下一行也是单重
    this.totalWeight = myExcel.getValueByCell(worksheet.getCell(row, startCol+13))
    this.material = myExcel.getValueByCell(worksheet.getCell(row, startCol+14))
    this.remarks = myExcel.getValueByCell(worksheet.getCell(row, startCol+15))

    this.dispatchPlace = ''
    this.rawPrice = ''
    this.processFee = ''
    this.galvanizedFee = ''
    this.packageFee = ''
    this.packageBoxFee = ''
    this.comprehensivePrice = ''
    this.totalPrice = ''
    this.priceRemark = ''

    //报价信息
    // this.dispatchPlace = myExcel.getValueByCell(worksheet.getCell(row, startCol+16))
    // this.rawPrice = myExcel.getValueByCell(worksheet.getCell(row, startCol+17))
    // this.processFee = myExcel.getValueByCell(worksheet.getCell(row, startCol+18))
    // this.galvanizedFee = myExcel.getValueByCell(worksheet.getCell(row, startCol+19))
    // this.packageFee = myExcel.getValueByCell(worksheet.getCell(row, startCol+20))
    // this.packageBoxFee = myExcel.getValueByCell(worksheet.getCell(row, startCol+21))
    // this.comprehensivePrice = myExcel.getValueByCell(worksheet.getCell(row, startCol+22))
    // this.totalPrice = myExcel.getValueByCell(worksheet.getCell(row, startCol+23))
    // this.priceRemark = myExcel.getValueByCell(worksheet.getCell(row, startCol+24))
  }
}

