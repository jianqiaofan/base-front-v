
import { getTrakcerPrice } from '@/views/pages/eset/trackers2/utils/sellerTool'

class Plan {
   constructor() {
    this.original_file_content = [],//保存原始的输入文件内容
    this.process_site = { post: '国内', beam: '国内', purlin: '国内' },
    this.spareParts = {
      post: 0.3,
      beam: 0.3,
      purlin: 0.3,
      fasten: 3,
      standard: 0.5,
      electricalMechanical: 0.5,
      other: 0
    }
    this.weather_station = [
       {
         id: 1,
         m_code: 'communication-station',
         des: '通信站',
         is_needed: true,
         unit_price:0,
         newest_price: 0,
         specifications: '通信设备等',
         suggest_amount: '每6Mw配置1套',
         is_accepted: true,
         amount: 1
       },
       {
         id: 2,
         m_code: 'fence-weather-station',
         des: '围网气象站',
         is_needed: true,
         unit_price:0,
         newest_price: 0,
         specifications: '风速仪等气象设备',
         suggest_amount: '每30Mw配置1套',
         is_accepted: true,
         amount: 1
       },
       {
         id: 3,
         m_code: 'SCADA-basic-equipment',
         des: 'SCADA',
         is_needed: true,
         unit_price:0,
         newest_price: 0,
         specifications: '主机、显示设备、软件费等',
         suggest_amount: '每个项目设置1套',
         is_accepted: true,
         amount: 1
       },
       {
         id: 4,
         m_code: 'SCADA-485-communication-module',
         des: 'SCADA',
         is_needed: true,
         unit_price:0,
         newest_price: 0,
         specifications: '485通信模块',
         suggest_amount: '入口和出口各设1套，中间每6MW设1套',
         is_accepted: true,
         amount: 3
       },
       {
         id: 5,
         m_code: 'SCADA-ring-network-switch',
         des: 'SCADA',
         is_needed: true,
         unit_price:0,
         newest_price: 0,
         specifications: '环网开关',
         suggest_amount: '入口和出口各设1套，中间每6MW设1套',
         is_accepted: true,
         amount: 1
       }
     ]
    this.trackersInfo = []
  }

  //将trackersInfo按串进行排序
  trackersInfoSort() {
    console.log('this.trackersInfo.length', this.trackersInfo.length)

    if (this.trackersInfo.length > 0) {
      const order = [
        'Exterior-1', 'Edge-1', 'Interior-1',
        'Exterior-2', 'Edge-2', 'Interior-2',
        'Exterior-3', 'Edge-3', 'Interior-3',
        'Exterior-4', 'Edge-4', 'Interior-4',
        'Exterior-5', 'Edge-5', 'Interior-5',
        'Exterior-6', 'Edge-6', 'Interior-6',
        'Exterior-7', 'Edge-7', 'Interior-7',
        'Exterior-8', 'Edge-8', 'Interior-8',
        'Exterior-9', 'Edge-9', 'Interior-9'
      ]

      let tlist = []
      order.forEach(o => {
        for (let i = 0; i < this.trackersInfo.length; i++) {
          if (this.trackersInfo[i].trackBrifeName.includes(o)) {
            tlist.push(this.trackersInfo[i])
            break
          }
        }
      })
      this.trackersInfo = tlist
    }
  }


}

class Tracker {
  constructor() {
    this.id = ''  //文件名称+‘-’+支架所在位置
    this.trackerNum = 0  //支架数量
    this.trackBrifeName = ''    //支架简称，位置+串数
    this.pvStringNum = ''//组件的串数
    this.rowColor = ''//行的颜色，区分内外围用外边内分别为红黄绿
    this.showPostBeamTable = false  //默认是否展开梁柱明细表
    this.ifCalculated = false  //是否已完成计算
    this.corrosion_proofing_grade = ''
    this.post_galvanizin_thickness = 0
    this.beam_galvanizin_thickness = 0
    this.purlin_galvanizin_thickness = 0
    this.beam_brand = ''
    this.purlin_brand = ''
    this.product_system = ''
    this.slew_drive_inch = ''
    this.slew_cover_if_need = false    //是否需要减速机罩
    this.dumper_num = ''
    this.dumper_type = ''
    this.spring_damper_num = ''  //弹簧阻尼，只有一种行程390
    this.power_supply = ''
    this.fweight_factor = ''  //大体上带法兰立柱的法兰重量调整系数，后面这个字段会弃除掉
    this.pile_type = 0  //桩型  0-桩柱一体  1-地脚螺栓 2-PHC管桩 3-钢桩
    this.pile_obj = 0//桩的对象（给后台进行Bom表生成）
    this.pile_desc = 0//桩的文字描述（给用户看的）
    this.purlin_info_lst = ''  //初始化一个檩条列表
    this.pv_length = 0  //光伏板长
    this.pv_width = 0  //光伏板宽
    this.pv_thickness = 0 //可能是板重量
    this.solar_list = []  //光伏板排布
    this.solar_num = 0    //一个支架光伏板的块数
    this.pv_capacity = 630  //光伏板容量(W) 默认630
    this.tracker_weight = 0  //单个支架重量(冗余的)
    this.trackerPrice = 0  //单个支架的价格(不含备品备件)
    this.pricePerWatt = 0  //瓦单价(不含备品备件)
    this.slew_count = ''  //减速机个数
    this.purlinCount = 0
    this.dis = ''    //双联排时，用于计算连接杆的长度
    this.pv_layout = '1P'    //1P或2P
    this.post_height = 2500  //柱子高度
    this.h_min = 500  //最小离地高度
    this.pv_iftp = ''  //光伏板是否通铺
    this.post_info_lst = ''  //立柱信息列表
    this.beam_info_lst = ''  //主梁信息列表
    this.beam_section_dim = ''  //主梁截面尺寸
    this.beam_section_type = ''  //主梁类型
    this.resultList = []    //存放Bom表数据
  }

  caculateThisTracker(trackerTotalCount, spareParts) {
    // this.resultList.bom1.forEach(b => {
    //   if (b.productCategory === 'Post') {
    //     console.log('bom1-show', b)
    //   }
    // })
    const boms = this.resultList.bom1
    // console.log('=========boms==================')
    // console.log(boms)
    //计算单个支架的总种
    this.tracker_weight = 0
    for (let i = 0; i < boms.length; i++) {
      this.tracker_weight += 1 * boms[i].totalWeight
    }
    this.total_tracker_weight = this.tracker_weight * this.trackerNum  //计算这一种支架的总重

    if (trackerTotalCount > 0) {
      this.trackerRatio = 100 * (this.trackerNum / trackerTotalCount).toFixed(4)
    }

    //计算容量
    this.solar_num = 0
    for (let i = 0; i < this.solar_list.length; i++) {
      this.solar_num += 1 * this.solar_list[i]
    }
    this.tracker_capacity = 0.001 * this.pv_capacity * this.solar_num  //单位是千瓦
    this.total_tracker_capacity = 1 * this.tracker_capacity * this.trackerNum

    //单套价格
    this.trackerPrice = 0
    for (let i = 0; i < boms.length; i++) {
      this.trackerPrice += 1 * boms[i].totalPrice
    }
    //这种支架全部的价格
    this.trackerTotalPrice = 1 * this.trackerPrice * this.trackerNum

    //元每W
    if (this.tracker_capacity > 0) {
      this.pricePerWatt = this.trackerPrice / (1000 * this.tracker_capacity)
    }

  }
}

//计算支架其它信息
function showTrackerBom(tracker, priceAdjust) {
  priceAdjust = {
    // '04-1-W8X13-Q355B-65': { rmp: 4850.0, utr: 0.97, sft: 1450.0, psf: 450.0, pkf: 0.0 },
    // '06-1-宝华-Purlin-1.5X30X30X60-S420GD-275.0': {},
    // '20-2-BP032-0.0': { rmp: 8 }
  }

  console.log('###tracker###', tracker)
  let bomData = tracker.resultList.bom1
  let bomErr = tracker.resultList.bomErr
  bomData.forEach(b => {
    let adjsutRatio = 1    //价格调整比例
    if (priceAdjust[b.priceId] !== undefined && b.costPrice > 0.001) {
      let pd = priceAdjust[b.priceId]  //原价格记录
      let newPrice = getPriceByDetail(pd)  //调整后的价格
      adjsutRatio = newPrice / b.costPrice
    }

    //不同计价方式，单价计算方式不同
    b._unitPrice = 1 * b.costPrice //默认方式
    b._adjustPrice = b._unitPrice * adjsutRatio  //调整后原材料单价
    if (b.priceMethod === '按吨重') {
      b._unitPrice = 0.001 * b.unitWeight * b.costPrice
    }  //按吨得计算时
    b._totalPrice = 1 * b._unitPrice * b.amount //1个支架含有本材料总价
    b._adjustUnitPrice = b._unitPrice * adjsutRatio  //调整后单件价格
    b._adjustTotalPrice = b._totalPrice * adjsutRatio //调整后1个支架含有本材料总价
  })

  let statisticsResult = [] //存入统计结果
  statisticsResult.push({
    staticName: '系统价格'
    // totalPrice: getTrackerTotalPrice(bomData, 'cost'),
    // categroyA: getTrackerCategroyA(bomData, 'cost')
  })  //按成本价统计
  statisticsResult.push({
    staticName: '设计师调价'
    // totalPrice: getTrackerTotalPrice(bomData, 'designer'),
    // categroyA: getTrackerCategroyA(bomData, 'designer')
  })  //按设计师调整后价统计

  console.log('statisticsResult', statisticsResult)

  //分成三张表
  let dividedBom = devideBomList(bomData)
  return {
    tableData1: dividedBom.bom1,
    tableData2: dividedBom.bom2,
    tableData3: dividedBom.bom3,
    tableDataErr: bomErr,  //错误提示信息
    statistics: statisticsResult
  }

}

//求本tracker调整后总价
function getTrackerTotalPrice(bomData, adjust) {
  let total = 0
  //根据不同的调价方案或调价人来，统计用总价也不同
  bomData.forEach(b => {
    let totalPrice = b._totalPrice
    if (adjust === 'designer') {
      totalPrice = b._adjustUnitPrice
    }//设计师调价
    total += totalPrice
  })
  return total
}

//按分类A方式统计
function getTrackerCategroyA(bomData, adjust, capacityAdjustRatio) {
  // adjust = {
  //   '04-1-W8X13-Q355B-65': {rmp:3850.0, utr:0.97, sft:1450.0, psf:450.0, pkf:0.0},
  //   '06-1-宝华-Purlin-1.5X30X30X60-S420GD-275.0':{},
  //   '20-2-BP032-0.0':{rmp:8}
  // }
  if (capacityAdjustRatio === undefined) {
    capacityAdjustRatio = 1.0
  }
  let categroy1 = {
    drivesSystem: 0,  //减速机
    controlSystem: 0,  //电气&机械
    damper: 0,  //阻尼器
    post: 0,  //H型钢
    torqueTube: 0,  //主梁
    purlin: 0,  //檩条
    stampingParts: 0,  //冲压件、冷弯件、拆弯件、焊接件、不锈钢件
    castingPart: 0,  //铸造件
    fastners: 0,  //紧固件
    others: 0
  }
  if (bomData === null || bomData === undefined) {
    return categroy1
  }
  //分类统计
  bomData.forEach(b => {
    let totalPrice = 0
    if (b.priceId in adjust) {
      b.costPrice = getPriceByDetail(adjust[b.priceId])   //调整后的价格
    }
    if (b.priceMethod === '按吨重') {
      totalPrice += 1 * b.amount * b.costPrice * b.unitWeight / 1000
    } else {
      totalPrice += 1 * b.amount * b.costPrice
    }

    if (b.priceId.slice(0, 2) === '01') {
      categroy1.drivesSystem += totalPrice
    } else if (b.priceId.slice(0, 2) === '02') {
      categroy1.controlSystem += totalPrice
    } else if (b.priceId.slice(0, 2) === '03') {
      categroy1.damper += totalPrice
    } else if (b.priceId.slice(0, 2) === '04') {
      categroy1.post += totalPrice * capacityAdjustRatio
    } else if (b.priceId.slice(0, 2) === '05') {
      categroy1.torqueTube += totalPrice * capacityAdjustRatio
    } else if (b.priceId.slice(0, 2) === '06') {
      categroy1.purlin += totalPrice * capacityAdjustRatio
    } else if (b.priceId.slice(0, 2) === '07') {
      categroy1.stampingParts += totalPrice
    } else if (b.priceId.slice(0, 2) === '08') {
      categroy1.castingPart += totalPrice
    } else if (b.priceId.slice(0, 2) === '09') {
      categroy1.fastners += totalPrice
    } else {
      categroy1.others += totalPrice
    }
  })
  return categroy1
}

//获取单个支架的总价
function getTrackerTotal(bomData) {
  let total = 0
  bomData.forEach(b => {
    total += 1 * b._totalPrice
  })
  return total
}

//获取单个支架的总价
function getTrackerTotalByDesigner(bomData) {
  let total = 0
  bomData.forEach(b => {
    total += 1 * b._designerTotalPrice
  })
  return total
}

//获取单个支架的总价
function getTrackerTotalByMy(bomData) {
  let total = 0
  bomData.forEach(b => {
    total += 1 * b._myTotalPrice
  })
  return total
}

//通过价格成分来计算综合单价
function getPriceByDetail(priceDetailObj) {
  // priceDetailObj={rmp:3950.0, utr:0.97, sft:1450.0, psf:450.0, pkf:0.0};
  const pd = priceDetailObj
  const price = (1 * pd.rmp / pd.utr + 1 * pd.psf
    + 1 * pd.sft + 1 * pd.pkf + 1 * pd.dfc - 1 * pd.exr + 1 * pd.imt + 1 * pd.ocf) //调整后的价格
  return price
}

//将表划分为三个或四个
function devideBomList(bomData) {
  let bom1 = []
  let bom2 = []
  let bom3 = []
  bomData.forEach(b => {
    if (b.productCategory === 'Post') {
      bom1.push(b)
    }
  })
  bomData.forEach(b => {
    if (b.productCategory === 'Torque Tube') {
      bom1.push(b)
    }
  })
  bomData.forEach(b => {
    if (b.productCategory === 'Purlin') {
      bom1.push(b)
    }
  })
  bomData.forEach(b => {
    if (b.productCategory === 'Stamping Parts') {
      bom1.push(b)
    }
  })
  bomData.forEach(b => {
    if (b.productCategory === 'Casting Part') {
      bom1.push(b)
    }
  })
  bomData.forEach(b => {
    if (b.productCategory === 'Other') {
      bom1.push(b)
    }
  })
  bomData.forEach(b => {
    if (b.productCategory === 'Fastners') {
      bom2.push(b)
    }
  })
  bomData.forEach(b => {
    if (b.productCategory === 'Drives System') {
      bom3.push(b)
    }
  })
  bomData.forEach(b => {
    if (b.productCategory === 'Control System') {
      bom3.push(b)
    }
  })
  bomData.forEach(b => {
    if (b.productCategory === 'Damper') {
      bom3.push(b)
    }
  })
  bomData.forEach(b => {
    if (b.productCategory === 'Others') {
      bom3.push(b)
    }
  })
  //给每个表加一个序号
  let m = 0
  let n = 0
  let k = 0
  bom1.forEach(b => {
    b._num = ++m
  })
  bom2.forEach(b => {
    b._num = ++n
  })
  bom3.forEach(b => {
    b._num = ++k
  })
  return {
    bom1: bom1,
    bom2: bom2,
    bom3: bom3
  }
}

//传入整个Plan,提取出所有价格ID并去重
function getPriceIds(plan) {
  const capacityAdjustRatio = getCapacityAdjustRatio(getPlanTotalCapacity(plan))
  let priceIds = []
  let priceIdObjs = []
  for (let i = 0; i < plan.trackersInfo.length; i++) {
    let t = plan.trackersInfo[i]
    t.resultList.bom1.forEach(b => {
      if (!priceIds.includes(b.priceId)) {
        let item = getPriceDecsription(b)
        let brand = ''
        if (b.priceId.slice(0, 2) === '05' || b.priceId.slice(0, 2) === '06') {
          if (b.priceId.indexOf('baohua') > -1) {
            brand = '宝华'
          }
          if (b.priceId.indexOf('yehui') > -1) {
            brand = '烨辉'
          }
          if (b.priceId.indexOf('shougang') > -1) {
            brand = '首钢'
          }
        }
        if (b.priceId.slice(0, 2) === '05') {
          item = '主梁：' + brand + item
        }
        if (b.priceId.slice(0, 2) === '06') {
          item = '檩条：' + brand + item
        }

        let obj = {
          id: b.priceId,
          item: item,
          cp: b.costPrice,  //成本价cost price
          pm: b.priceMethod,  //price method
          pd: JSON.parse(toJsonString(b.priceDetail))  //价格组成 price detail
        }
        priceIds.push(b.priceId)
        priceIdObjs.push(obj)
      }
    })
  }
  priceIdObjs.sort((a, b) => a.id.localeCompare(b.id))

  //二次排序，将价值比较低的排在后面
  let newObjs1 = []
  let newObjs2 = []
  for (const p of priceIdObjs) {
    if (p.cp > 100) {
      newObjs1.push(p)
    } else {
      newObjs2.push(p)
    }
  }
  priceIdObjs = [...newObjs1, ...newObjs2]

  return getTotalByMaterialId(priceIdObjs, getPlanTotalCapacity(plan))
}

//按系统价格对各材料进行总价的统计
function getTotalByMaterialId(systemPrice, totalCapacity) {
  //fdsa
  for (let i = 0; i < systemPrice.length; i++) {
    if (systemPrice[i].pd.rmp === undefined) {
      systemPrice[i].pd.rmp = systemPrice[i].cp
    }
    if (systemPrice[i].pd.utr === undefined) {
      systemPrice[i].pd.utr = 1.0
    }
    if (systemPrice[i].pd.psf === undefined) {
      systemPrice[i].pd.psf = 0
    }
    if (systemPrice[i].pd.sft === undefined) {
      systemPrice[i].pd.sft = 0
    }
    if (systemPrice[i].pd.pkf === undefined) {
      systemPrice[i].pd.pkf = 0
    }
    if (systemPrice[i].pd.dfc === undefined) {
      systemPrice[i].pd.dfc = 0
    }
    if (systemPrice[i].pd.exr === undefined) {
      systemPrice[i].pd.exr = 0
    }
    if (systemPrice[i].pd.imt === undefined) {
      systemPrice[i].pd.imt = 0
    }
    if (systemPrice[i].pd.ocf === undefined) {
      systemPrice[i].pd.ocf = 0
    }
  }
  for (let i = 0; i < systemPrice.length; i++) {
    let pd = systemPrice[i].pd
    if (+pd.utr <= 0) {
      pd.utr = 1.0
    }
    systemPrice[i].afterAdjustPrice = (1 * pd.rmp / pd.utr + 1 * pd.psf
      + 1 * pd.sft + 1 * pd.pkf + 1 * pd.dfc - 1 * pd.exr + 1 * pd.imt + 1 * pd.ocf).toFixed(2)  //调整后的价格
  }

  //将零显示为空格
  for (let i = 0; i < systemPrice.length; i++) {
    let pd = systemPrice[i].pd
    if (systemPrice[i].pd.rmp === 0) {
      systemPrice[i].pd.rmp = ''
    }
    if (systemPrice[i].pd.utr === 0) {
      systemPrice[i].pd.utr = ''
    }
    if (systemPrice[i].pd.psf === 0) {
      systemPrice[i].pd.psf = ''
    }
    if (systemPrice[i].pd.sft === 0) {
      systemPrice[i].pd.sft = ''
    }
    if (systemPrice[i].pd.pkf === 0) {
      systemPrice[i].pd.pkf = ''
    }
    if (systemPrice[i].pd.dfc === 0) {
      systemPrice[i].pd.dfc = ''
    }
    if (systemPrice[i].pd.exr === 0) {
      systemPrice[i].pd.exr = ''
    }
    if (systemPrice[i].pd.imt === 0) {
      systemPrice[i].pd.imt = ''
    }
    if (systemPrice[i].pd.ocf === 0) {
      systemPrice[i].pd.ocf = ''
    }
  }
  // this.getItemTotalPrice()  //按priceId分类，计算各priceId的总价
  return systemPrice
}

//生成价格Id的描述信息(让人能够看懂的描述)
function getPriceDecsription(bomList) {
  let description = ''
  if (bomList.productCategory === 'Drives System') {
    description = bomList.name
  } else if (bomList.productCategory === 'Control System') {
    description = bomList.name
  } else if (bomList.productCategory === 'Damper') {
    description = bomList.name
  } else if (bomList.productCategory === 'Post') {
    description = bomList.specification + ',' + bomList.material + ',' + bomList.surfaceTreatment.replace('平均厚度', '')
  } else if (bomList.productCategory === 'Torque Tube') {
    // description = "镀锌铝镁,厚度2.3,镀层？275"
    if (bomList.specification.includes('x')) {
      description = '锌铝镁,' + bomList.material + ',' + (bomList.specification).split('x')[1] + 'mm,' + bomList.surfaceTreatment.replace('锌铝镁', '')
    } else {
      description = '锌铝镁,' + bomList.material + ',' + bomList.specification + ',' + bomList.surfaceTreatment.replace('锌铝镁', '')
    }
  } else if (bomList.productCategory === 'Purlin') {
    let specification = bomList.specification.replaceAll('X', 'x').replace('-', '')
    if (specification.includes('x')) {
      description = '锌铝镁,' + bomList.material + ',' + specification.split('x')[0] + 'mm,' + bomList.surfaceTreatment.replace('锌铝镁', '')
    } else {
      description = '锌铝镁,' + bomList.material + ',' + bomList.specification + ',' + bomList.surfaceTreatment.replace('锌铝镁', '')
    }
  } else if (bomList.productCategory === 'Stamping Parts') {
    description = bomList.name
  } else if (bomList.productCategory === 'Casting Part') {
    description = bomList.name
  } else if (bomList.productCategory === 'Fastners') {
    description = bomList.name
  } else {
    description = bomList.name
  }
  return description
}

function toJsonString(str) {
  str = str.replaceAll(' ', '').trim()
  str = str.replaceAll('rmp:', '"rmp":')
  str = str.replaceAll('utr:', '"utr":')
  str = str.replaceAll('sft:', '"sft":')
  str = str.replaceAll('psf:', '"psf":')
  str = str.replaceAll('pkf:', '"pkf":')
  return str

}

//补全支架的属性
function calculateTrackerAttributes(tracker) {
  let newTracker = JSON.parse(JSON.stringify(tracker))
  let bomData = newTracker.resultList.bom1
  bomData.forEach(b => {
    //计算单价
    b._unitPrice = 1 * b.costPrice //默认方式
    //按吨得计算时
    if (b.priceMethod === '按吨重') {
      b._unitPrice = 0.001 * b.unitWeight * b.costPrice
    }
  })
  return newTracker
}

function getBomUnitPrice(priceMethod, costPrice, unitWeight) {
  //传入Bom表中一条记录对象，计算该材料的单价
  let unitPrice = 1 * costPrice //默认方式
  //按吨得计算时
  if (priceMethod === '按吨重') {
    unitPrice = 0.001 * unitWeight * costPrice
  }
  return unitPrice
}

function getAdjustCostPrice(bom, adjust) {
  // adjust = {"01-2-SlewDrive-5inch1Class-0.0":{"rmp":"1200","utr":1,"psf":"","sft":"","pkf":"","dfc":"","exr":"","imt":"","ocf":""}}
  //默认成本价等于原价
  let adjustCost = bom.costPrice
  //计算新的综合单价
  if (bom.priceId in adjust) {
    let pd = adjust[bom.priceId]
    adjustCost = (1 * pd.rmp / pd.utr
      + 1 * pd.psf + 1 * pd.sft + 1 * pd.pkf + 1 * pd.dfc - 1 * pd.exr + 1 * pd.imt + 1 * pd.ocf)
  }
  return adjustCost
}

//生成表单的Source数据
function getEcharSourceCategory1(priceData, planPriceAdjust) {
  // console.log("classPlan_priceData:",priceData)
  // console.log("classPlan_planPriceAdjust:",planPriceAdjust)
  let objs = []
  let name = []
  let adjust = []
  for (let i = 0; i < planPriceAdjust.length; i++) {
    name.push(planPriceAdjust[i].who_adjust)
    adjust.push(planPriceAdjust[i].adjust_price_details)
  }
  let category = ['01-减速机', '02-控制系统', '03-阻尼', '04-立柱', '05-主梁', '06-檩条', '07-冲压件', '08-铸造件', '09-紧固件', '20-其它']
  for (let i = 0; i < category.length; i++) {
    let obj = { price: category[i].split('-')[1] }
    for (let j = 0; j < name.length; j++) {
      obj[name[j]] = getItemTotal(priceData, category[i].split('-')[0] + '-', adjust[j]).toFixed(2)
    }
    objs.push(obj)
  }
  return objs
}

//计算单项的总价
function getItemTotal(priceData, categoryCode, adjust) {
  let totalPrice = 0
  // adjust = {
  //   '01-2-SlewDrive-5inch1Class-0.0': 1890,
  //   '02-2-ESET-TCU-M-0.0': 700,
  //   '02-2-ESET-TCU-S-0.0': 220,
  //   '04-1-W6X6.2-Q355B-65': 6000
  // }
  for (let i = 0; i < priceData.length; i++) {
    if (priceData[i].id.includes(categoryCode)) {
      if (priceData[i].id in adjust) {  //有价格调整时
        totalPrice += 1 * priceData[i].totalPriceBySystem
          * getAdjustFactor(priceData[i].id, adjust[priceData[i].id], priceData)
      } else {
        totalPrice += 1 * priceData[i].totalPriceBySystem
      }
    }
  }
  return totalPrice
}

//某一位调价人调价后的数据统计
function getSummaryPrice(plan, priceAdjust) {
  // console.log('getSummaryPrice=',priceAdjust)
  //计算方案总容量和容量调整系数
  const capacityAdjustRatio = getCapacityAdjustRatio(getPlanTotalCapacity(plan))
  let objList = []
  const trackers = plan.trackersInfo
  let planTrackerNum = 0
  trackers.forEach(t => {
    planTrackerNum += 1 * t.trackerNum
  })  //计算总数量
  let num = 0
  for (const tr of trackers) {
    const trackerTotalPrice = getTrakcerPrice(tr.resultList.bom1, priceAdjust.adjust_price_details, capacityAdjustRatio) //单个支架总价格
    const trackerCapacity = 1 * tr.solar_num * tr.pv_capacity //单个支架总容量(瓦)
    if (tr.resultList.bom1 !== undefined && tr.resultList.bom1.length > 0 && tr.trackerNum > 0) {
      let obj = {
        num: ++num,
        trackerBrifeName: tr.trackBrifeName,
        trackerNum: tr.trackerNum,
        trackerCapacity: 0.001 * trackerCapacity,
        trackerTotalCapacity: 0.001 * tr.trackerNum * trackerCapacity,
        totalPrice: trackerTotalPrice, //总价
        pricePerWatt: trackerTotalPrice / trackerCapacity, //瓦单价,
        price_composition: getTrackerCategroyA(tr.resultList.bom1, priceAdjust.adjust_price_details, capacityAdjustRatio) //支架价格组成
      }
      objList.push(obj)
    }
  }
  let planTotalCapacity = 0
  objList.forEach(t => {
    planTotalCapacity += t.trackerTotalCapacity
  })  //计算本方案的总容量
  let planTotalPrice = 0
  objList.forEach(t => {
    planTotalPrice += t.totalPrice * t.trackerNum
  })  //计算本方案的总价格
  let planPricePerWatt = 0
  if (planTotalCapacity > 0) {
    planPricePerWatt = planTotalPrice / planTotalCapacity / 1000
  }  //计算本方案的综合瓦单价

  let rObj = {
    tracker: objList,
    planTrackerNum: planTrackerNum,
    planTotalCapacity: planTotalCapacity,
    planTotalPrice: planTotalPrice,
    planPricePerWatt: planPricePerWatt

  }
  return rObj
}

//计算方案总容量
function getPlanTotalCapacity(plan) {
  let total = 0
  plan.trackersInfo.forEach(tr => {
    total += 1 * tr.solar_num * tr.pv_capacity * tr.trackerNum
  })
  return total
}

//容量调整系数 <5Mw:1.1;5-20Mw:1.05，>20Mw:1
//只对立柱、主梁、檩条进行调整
function getCapacityAdjustRatio(totalCapacity) {
  let ratio = 1.0
  if (totalCapacity / 1000000 <= 5) {
    ratio = 1.1
  } else if (totalCapacity / 1000000 <= 20) {
    ratio = 1.05
  }
  return ratio
}

//多位调价者的统计数据
function getSummarysPrice(plan, priceAdjusts) {
  let rObj = []
  for (const pad of priceAdjusts) {
    let obj = getSummaryPrice(plan, pad)
    obj.whoAdjust = pad.who_adjust
    rObj.push(obj)
  }
  return rObj
}

function getWeightDetails(plan) {
  let objList = []
  const trackers = plan.trackersInfo
  let num = 0
  for (const tr of trackers) {
    const trackerCapacity = 1 * tr.solar_num * tr.pv_capacity //单个支架总容量(瓦)
    const trackerWeight = getTrackerWeightTotal(tr.resultList.bom1) //1套支架的总重量
    const trackerMainWeight = getTrackerWeightStructureMain(tr.resultList.bom1)
    if (tr.resultList.bom1 !== undefined && tr.resultList.bom1.length > 0 && tr.trackerNum > 0) {
      let obj = {
        num: ++num,
        trackBrifeName: tr.trackBrifeName,
        trackerNum: tr.trackerNum,
        tracker_capacity: trackerCapacity / 1000,
        trackerWeight: trackerWeight,  //本支架1个的重量
        trackerTotalWeight: trackerWeight * tr.trackerNum,  //本支架全部重量
        weightStructureMain: trackerMainWeight,
        weightStructureOther: getTrackerWeightStructureOther(tr.resultList.bom1),
        weightElectricalMechanical: getTrackerWeightElectricalMechanical(tr.resultList.bom1),
        weight_composition: getTrackerWeightCategroyA(tr.resultList.bom1), //支架重量组成
        weightPerMw: 1000 * trackerMainWeight / trackerCapacity
      }
      objList.push(obj)
    }
  }

  //计算各分支的总重量
  let totalWeight = 0
  objList.forEach(t => {
    totalWeight += 1 * t.trackerWeight * t.trackerNum
  })
  let totalMainWeight = 0  //主材总重
  objList.forEach(t => {
    totalMainWeight += 1 * t.weightStructureMain * t.trackerNum
  })
  let totalCapacity = 0 //总容量
  objList.forEach(t => {
    totalCapacity += 1000 * t.tracker_capacity * t.trackerNum
  })
  let totalTrackerNum = 0
  objList.forEach(t => {
    totalTrackerNum += 1 * t.trackerNum
  })
  let drivesSystem = 0
  objList.forEach(t => {
    drivesSystem += t.weight_composition.drivesSystem * t.trackerNum
  })
  let controlSystem = 0
  objList.forEach(t => {
    controlSystem += t.weight_composition.controlSystem * t.trackerNum
  })
  let damper = 0
  objList.forEach(t => {
    damper += t.weight_composition.damper * t.trackerNum
  })
  let post = 0
  objList.forEach(t => {
    post += t.weight_composition.post * t.trackerNum
  })
  let torqueTube = 0
  objList.forEach(t => {
    torqueTube += t.weight_composition.torqueTube * t.trackerNum
  })
  let purlin = 0
  objList.forEach(t => {
    purlin += t.weight_composition.purlin * t.trackerNum
  })
  let stampingParts = 0
  objList.forEach(t => {
    stampingParts += t.weight_composition.stampingParts * t.trackerNum
  })
  let castingPart = 0
  objList.forEach(t => {
    castingPart += t.weight_composition.castingPart * t.trackerNum
  })
  let fastners = 0
  objList.forEach(t => {
    fastners += t.weight_composition.fastners * t.trackerNum
  })
  let others = 0
  objList.forEach(t => {
    others += t.weight_composition.others * t.trackerNum
  })

  let totalObj = {
    totalWeight: totalWeight / 1000,  //整个方案总重量
    totalTrackerNum: totalTrackerNum,  //整个方案总重量
    totalMainWeight: totalMainWeight, //整个方案主材总重量
    totalCapacity: totalCapacity,//总容量
    totalMainWeightPerMw: 1000 * totalMainWeight / totalCapacity,
    drivesSystem: drivesSystem,
    controlSystem: controlSystem,
    damper: damper,
    post: post,
    torqueTube: torqueTube,
    purlin: purlin,
    stampingParts: stampingParts,
    castingPart: castingPart,
    fastners: fastners,
    others: others
  }
  return { tracker: objList, total: totalObj }
}

function getPileDetails(plan) {
  let objList = []
  const trackers = plan.trackersInfo
  let num = 0
  for (const tr of trackers) {
    const trackerCapacity = 1 * tr.solar_num * tr.pv_capacity //单个支架总容量(瓦)
    const pileInfo = getTrackerPileInfo(tr) //桩类型
    const price10Cm = getPile10CmPriceInfo(tr)  //桩10cm信息
    if (tr.resultList.bom1 !== undefined && tr.resultList.bom1.length > 0 && tr.trackerNum > 0) {
      let obj = {
        num: ++num,
        trackBrifeName: tr.trackBrifeName,
        trackerNum: tr.trackerNum,
        tracker_capacity: trackerCapacity / 1000,
        tracker_pile_num: tr.post_info_lst.length,
        trackers_pile_num: tr.post_info_lst.length * tr.trackerNum,
        pileType: pileInfo[0],
        pileMaxLength: pileInfo[1],
        pileMinLength: pileInfo[2],
        pileAverageLength: pileInfo[3],
        price_10cm: price10Cm
      }
      objList.push(obj)
    }
  }

  let totalObj = {}
  return { tracker: objList, total: totalObj }
}

function getTrackerPileInfo(tracker) {
  let pt = []  //桩型数组
  let pLen = []  //桩长数组
  tracker.post_info_lst.forEach(p => {
    pt.push(p.pile_type)
  })

  let type = '无'
  let maxLength = 0
  let minLength = 0
  let averageLength = 0
  if (pt[0] === 0) {
    type = '桩柱一体'
    tracker.post_info_lst.forEach(p => {
      pLen.push(p.pile_obj.pile_depth)
    })
    maxLength = Math.max(...pLen)
    minLength = Math.min(...pLen)
    let sum = pLen.reduce((a, b) => a + 1 * b, 0)
    averageLength = Math.round(sum / pLen.length)
  }
  if (pt[0] === 1) {
    type = '地脚螺栓'
  }
  if (pt[0] === 2) {
    type = 'PHC管桩'
  }
  if (pt[0] === 3) {
    type = '钢桩'
    tracker.post_info_lst.forEach(p => {
      pLen.push(p.pile_obj.pile_body.length)
    })
    maxLength = Math.max(...pLen)
    minLength = Math.min(...pLen)
    let sum = pLen.reduce((a, b) => a + 1 * b, 0)
    averageLength = Math.round(sum / pLen.length)
  }
  return [type, maxLength, minLength, averageLength]
}

//获得桩10cm的价格、瓦单价、占总价的百分比
function getPile10CmPriceInfo(tracker) {
  let pt = []  //桩型数组
  tracker.post_info_lst.forEach(p => {
    pt.push(p.pile_type)
  })
  let type = '无'
  let price_10cm = 0
  if (pt[0] === 0) {
    type = '桩柱一体'
    tracker.resultList.bom1.forEach(b => {
      if (b.productCategory === 'Post') {
        price_10cm += 0.1 * b.amount * b.weightPerMater * b.costPrice / 1000
      }
    })
  }
  if (pt[0] === 1) {
    type = '地脚螺栓'
  }
  if (pt[0] === 2) {
    type = 'PHC管桩'
  }
  if (pt[0] === 3) {
    type = '钢桩'
    tracker.resultList.bom1.forEach(b => {
      if (b.productCategory === 'Post') {
        if (b.name === '钢桩' || b.name === '立柱') {
          price_10cm += 0.1 * b.amount * b.weightPerMater * b.costPrice / 1000
        }
      }
    })
  }
  return Math.round(100 * price_10cm) / 100
}

function getTrackerWeightTotal(bom) {
  let totalWeight = 0
  bom.forEach(b => {
    totalWeight += 1 * b.totalWeight
  })
  return totalWeight
}

//结构件(主材：立柱、主梁、檩条)
function getTrackerWeightStructureMain(bom) {
  const items = ['04', '05', '06']
  let totalWeight = 0
  bom.forEach(b => {
    if (items.includes(b.priceId.slice(0, 2))) {
      totalWeight += 1 * b.totalWeight
    }
  })
  return totalWeight
}

//结构件(非主材)
function getTrackerWeightStructureOther(bom) {
  const notItems = ['01', '02', '03', '04', '05', '06']
  let totalWeight = 0
  bom.forEach(b => {
    if (!notItems.includes(b.priceId.slice(0, 2))) {
      totalWeight += 1 * b.totalWeight
    }
  })
  return totalWeight
}

//电气与机械
function getTrackerWeightElectricalMechanical(bom) {
  const items = ['01', '02', '03']
  let totalWeight = 0
  bom.forEach(b => {
    if (items.includes(b.priceId.slice(0, 2))) {
      totalWeight += 1 * b.totalWeight
    }
  })
  return totalWeight
}

//按A分类法统计各成分的重量
function getTrackerWeightCategroyA(bomData) {
  let categroy1 = {
    drivesSystem: 0,  //减速机
    controlSystem: 0,  //电气&机械
    damper: 0,  //阻尼器
    post: 0,  //H型钢
    torqueTube: 0,  //主梁
    purlin: 0,  //檩条
    stampingParts: 0,  //冲压件、冷弯件、拆弯件、焊接件、不锈钢件
    castingPart: 0,  //铸造件
    fastners: 0,  //紧固件
    others: 0
  }
  if (bomData === null || bomData === undefined) {
    return categroy1
  }
  //分类统计
  bomData.forEach(b => {
    let totalWeight = 1 * b.totalWeight
    if (b.priceId.slice(0, 2) === '01') {
      categroy1.drivesSystem += totalWeight
    } else if (b.priceId.slice(0, 2) === '02') {
      categroy1.controlSystem += totalWeight
    } else if (b.priceId.slice(0, 2) === '03') {
      categroy1.damper += totalWeight
    } else if (b.priceId.slice(0, 2) === '04') {
      categroy1.post += totalWeight
    } else if (b.priceId.slice(0, 2) === '05') {
      categroy1.torqueTube += totalWeight
    } else if (b.priceId.slice(0, 2) === '06') {
      categroy1.purlin += totalWeight
    } else if (b.priceId.slice(0, 2) === '07') {
      categroy1.stampingParts += totalWeight
    } else if (b.priceId.slice(0, 2) === '08') {
      categroy1.castingPart += totalWeight
    } else if (b.priceId.slice(0, 2) === '09') {
      categroy1.fastners += totalWeight
    } else {
      categroy1.others += totalWeight
    }
  })
  return categroy1
}

//计算调价系数
function getAdjustFactor(id, newPrice, priceData) {
  let adf = 1
  for (let i = 0; i < priceData.length; i++) {
    if (priceData[i].id === id) {
      if (1 * priceData[i].cp < 0.001) {
        adf = 1
      } else {
        let pd = newPrice
        let price = (1 * pd.rmp / pd.utr
          + 1 * pd.psf + 1 * pd.sft + 1 * pd.pkf + 1 * pd.dfc - 1 * pd.exr + 1 * pd.imt + 1 * pd.ocf)
        adf = 1 * price / (1 * priceData[i].cp)
      }
      break
    }
  }
  return adf
}

export {
  Plan,
  Tracker,
  getTrackerCategroyA,
  showTrackerBom,
  getPriceIds,
  calculateTrackerAttributes,
  getEcharSourceCategory1,
  getTrackerWeightCategroyA,
  getBomUnitPrice,
  getAdjustCostPrice,
  getTrackerTotal,
  getTrackerTotalByDesigner,
  getTrackerTotalByMy,
  getSummarysPrice,
  getSummaryPrice,
  getWeightDetails,
  getPileDetails,
  getPlanTotalCapacity,
  getCapacityAdjustRatio
}
