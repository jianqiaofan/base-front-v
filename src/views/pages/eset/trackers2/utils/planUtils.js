//方案后处理

import myUtils from '@/api/eset/myUntils'

export default {
  planCompute(trackerPlan, adjust) {
    const start_time = Date.now()
    //算其它指标，要用到这两个指标
    let tp = JSON.parse(JSON.stringify(trackerPlan))  //total plan
    tp.planTrackerNum = 0  //总支架数量
    tp.planCapacity = 0  //总容量
    if (tp.trackersInfo.length !== undefined && tp.trackersInfo.length > 0) {
      tp.planTrackerNum = tp.trackersInfo.reduce((a, b) => a + +b.trackerNum, 0)  //总支架数量
      tp.planCapacity = tp.trackersInfo.reduce((a, b) => a + b.pv_capacity * b.trackerNum * b.solar_list.reduce((c, d) => 1*c + 1*d), 0)  //总容量
    }

    console.time('耗时')
    let spareParts = tp.spareParts  //备品备件率对象
    let trackers = tp.trackersInfo
    tp.totalTrackerNum = trackers.reduce((a, b) => a + b.trackerNum * 1, 0)  //支架总数
    for (let i = 0; i < trackers.length; i++) {
      console.log('trackers[i]',trackers[i])
      trackers[i].trackerPostInfoList = trackers[i].post_info_lst || []
      let bom = trackers[i].resultList.bom1
      if (bom !== undefined && bom.length > 0) {
        bom.forEach(b => {
          //如果有调价信息，将成本价改为调价的信息
          b.systemPrice = b.costPrice //系统原始价(防止调价后看不到原价)
          b.trackerNum = trackers[i].trackerNum  //后面计算材料总价时需要
          b.priceDetailObj = getObjCostDetail(b.costPrice, b.priceDetail)  //成本价信息
          b.unitPrice = unitPrice(b.priceMethod, b.costPrice, b.unitWeight)
          b.totalPrice = b.unitPrice * b.amount
          b.sparePartRatio = getSparePartRatio(spareParts, b.priceId)
          b.totalPriceSpare = b.totalPrice * (1 + 0.01 * b.sparePartRatio)
          b.totalWeight = b.unitWeight * b.amount
          b.totalWeightSpare = b.totalWeight * (1 + 0.01 * b.sparePartRatio)  //含备品备件后总重
        })
        //处理调价信息
        if (adjust !== undefined && adjust.length > 0) {
          let adjustList = adjust.map(m => m.price_id)
          bom.forEach(b => {
            if (adjustList.includes(b.priceId)) {
              const arr = adjust.filter(m => m.price_id === b.priceId).sort((a, b) => 1 * b.create_time - 1 * a.create_time)
              b.costPrice = arr[0].new_price
              b.unitPrice = unitPrice(b.priceMethod, b.costPrice, b.unitWeight)
              b.totalPrice = b.unitPrice * b.amount
              b.priceDetailObj = getObjCostDetail(b.costPrice, b.priceDetail, arr)
              b.totalPriceSpare = b.totalPrice * (1 + 0.01 * b.sparePartRatio)
            }
          })
        }
        trackers[i].pvCapacity = trackers[i].pv_capacity //光伏组件容量
        trackers[i].solarList = trackers[i].solar_list.join(',') //光伏组件排布
        trackers[i].trackerPrice = bom.reduce((a, b) => a + b.totalPrice, 0)  //单个支架总价格
        trackers[i].trackerPriceSpare = bom.reduce((a, b) => a + b.totalPriceSpare, 0)  //单个支架总价格(含备品备件)
        trackers[i].trackerWeight = bom.reduce((a, b) => a + b.totalWeight, 0)//单个支架总重量
        trackers[i].trackerWeightSpare = bom.reduce((a, b) => a + b.totalWeightSpare, 0)//单个支架总重量(含备品备件)
        trackers[i].trackerWeightOnlyStructureSpare = bom.filter(bo=>['04','05','06','07','08','09'].includes(bo.priceId.substring(0,2))).reduce((a, b) => a + b.totalWeightSpare, 0)//单个支架总重量(不含机械电气，含备品备件)
        trackers[i].solar_num = trackers[i].solar_list.reduce((a, b) => a + +b, 0)
        trackers[i].trackerCapacity = trackers[i].pv_capacity * trackers[i].solar_num //单个支架容量
        trackers[i].pricePerWatt = trackers[i].trackerPrice / trackers[i].trackerCapacity //单个支架瓦单价
        trackers[i].pricePerWattSpare = trackers[i].trackerPriceSpare / trackers[i].trackerCapacity //单个支架瓦单价(含备品备件)
        trackers[i].trackerNumRatio = trackers[i].trackerNum / tp.totalTrackerNum  //支架数量占比
        trackers[i].trackerTotalCapacity = trackers[i].trackerCapacity * trackers[i].trackerNum //本类型支架总容量
        // console.log('trackers[i].trackerPostInfoList===================================================')
        // console.log(trackers[i].trackerPostInfoList)
        // console.log(trackers[i])
      }
    }

    //计算气象站指标
    let ws = tp.weather_station.filter(w => w.is_needed)  //气象站选配的材料
    tp.weatherStationTotalPrice = ws.reduce((a, b) => a + b.unit_price * b.amount * 1, 0)
    tp.weatherStationPricePerWatt = tp.weatherStationTotalPrice / tp.planCapacity

    //整个方案数据指标
    tp.planTrice = trackers.reduce((a, b) => a + b.trackerPrice * b.trackerNum, 0) + tp.weatherStationTotalPrice //总价格(含气象站)
    tp.planTriceSpare = trackers.reduce((a, b) => a + b.trackerPriceSpare * b.trackerNum, 0) + tp.weatherStationTotalPrice //总价格(含气象站，含备品备件)
    tp.planWeight = trackers.reduce((a, b) => a + b.trackerWeight * b.trackerNum, 0)  //整个方案的重量
    tp.planWeightSpare = trackers.reduce((a, b) => a + b.trackerWeightSpare * b.trackerNum, 0)  //整个方案的重量(含备品备件)
    tp.planWeightOnlyStructure = trackers.reduce((a, b) => a + b.trackerWeightOnlyStructure * b.trackerNum, 0)  //整个方案的重量(不含机械电器)
    tp.planWeightOnlyStructureSpare = trackers.reduce((a, b) => a + b.trackerWeightOnlyStructureSpare * b.trackerNum, 0)  //整个方案的重量(不含机械电器，含备品备件)
    tp.planPricePerWatt = tp.planTrice / tp.planCapacity  //整个方案的瓦单价
    tp.planPricePerWattSpare = tp.planTriceSpare / tp.planCapacity  //整个方案的瓦单价

    //生成材料价格表(价格部门可以查价改价)
    let arr = []  //将所有的bom清单放在一个数组里
    for (let i = 0; i < trackers.length; i++) {
      let bom = trackers[i].resultList.bom1
      if (bom !== undefined && bom.length > 0) {
        bom.forEach(b => arr.push(b))
      }
    }
    if (arr.length > 0) {
      tp.priceMsg = priceTable(arr)//生成纯粹的价格表
    }

    tp.summaryData = summaryData(tp)  //summary表信息

    if (trackers.length > 0) {
      tp.pileInfoStatistics = planPileInfoMsg(tp)  //桩信息统计信息
    }
    if (trackers.length > 0) {
      tp.trackerCorrosionInfo = planTrackerCorrosionInfoMsg(tp)  //支架防腐信息
    }
    if (trackers.length > 0) {
      tp.trackerGeometryInfo = planTrackerGeometryInfoMsg(tp)  //支架几何信息
    }


    console.log('总耗时:', Date.now() - start_time, '毫秒')
    console.timeEnd('耗时')
    return tp
  }
}

function summaryData(plan) {
  let tr = plan.trackersInfo
  let r = []
  if (tr !== undefined) {
    tr.forEach(t => {
      if(t.trackerNum>0.1){
        r.push({
          trackBrifeName: t.trackBrifeName, //型号
          pvCapacity: t.pv_capacity, //光伏组件容易
          solarList: t.solarList, //光伏组件排布
          trackerNum: t.trackerNum,  // 数量
          trackerNumRatio: 100 * t.trackerNumRatio,  // 占比
          trackerWeight: t.trackerWeight,  //单套重量，不含备品备件
          trackerWeightSpare: t.trackerWeightSpare,  //单套重量，含备品备件
          trackerCapacity: t.trackerCapacity / 1000,  //单套容量
          trackerTotalWeight: t.trackerWeight * t.trackerNum,  //总重量（一种型号支架的，不含备品备件）
          trackerTotalWeightSpare: t.trackerWeightSpare * t.trackerNum,  //总重量（一种型号支架的，含备品备件）
          trackerTotalWeightOnlyStructureSpare: t.trackerWeightOnlyStructureSpare * t.trackerNum,  //总重量（一种型号支架的，不含机械电器,含备品备件）
          trackerTotalCapacity: t.trackerCapacity * t.trackerNum / 1000,  //总容量（一种型号支架的）
          trackerPrice: t.trackerPrice,  //单套价格
          trackerTotalPrice: t.trackerPrice * t.trackerNum,  //总价格（一种型号支架的）
          pricePerWatt: t.pricePerWatt,  //瓦单价
          trackerPriceSpare: t.trackerPriceSpare,  //单套价格（含备品备件）
          trackerTotalPriceSpare: t.trackerPriceSpare * t.trackerNum,  //总价格（一种型号支架的，含备品备件）
          pricePerWattSpare: t.pricePerWattSpare  //瓦单价（含备品备件）
        })
      }
    })
    //气象站
    if(plan.weatherStationTotalPrice>0.1){
      r.push({
        trackBrifeName: 'weather station', //型号
        trackerNum: '',  // 数量
        trackerNumRatio: '',  // 占比
        trackerWeight: '',  //单套重量
        trackerWeightSpare: '',  //单套重量，含备品备件
        trackerCapacity: '',  //单套容量
        trackerTotalWeightSpare: '',  //总重量（一种型号支架的，含备品备件）
        trackerTotalWeightOnlyStructureSpare: '',  //总重量（一种型号支架的，不含机械电器,含备品备件）
        trackerTotalCapacity: '',  //总容量（一种型号支架的）
        trackerPrice: '',  //单套价格
        trackerTotalPrice: plan.weatherStationTotalPrice,  //气象站总价格
        pricePerWatt: plan.weatherStationPricePerWatt,  //气象站价格瓦单价
        trackerPriceSpare: '',
        trackerTotalPriceSpare: plan.weatherStationTotalPrice,  //气象站总价格,
        pricePerWattSpare: plan.weatherStationPricePerWatt,  //气象站总价格,
      })
    }
    r.push({
      trackBrifeName: '合计', //型号
      trackerNum: plan.planTrackerNum,  // 数量
      trackerNumRatio: '',  // 占比
      trackerWeight: '',
      trackerCapacity: '',
      trackerTotalWeight: plan.planWeight,  //整个方案总重量,不含备品备件
      trackerTotalWeightSpare: plan.planWeightSpare,  //整个方案总重量,含备品备件
      trackerTotalWeightOnlyStructureSpare: plan.planWeightOnlyStructureSpare,  //总重量（一种型号支架的，不含机械电器,含备品备件）
      trackerTotalCapacity: plan.planCapacity / 1000,  //整个方案总重量总容量
      trackerPrice: '',
      trackerTotalPrice: plan.planTrice,  //整个方案总价格
      pricePerWatt: plan.planPricePerWatt,  //整个方案瓦单价
      trackerPriceSpare: '',
      trackerTotalPriceSpare: plan.planTriceSpare,  //整个方案总价格（含备品备件）
      pricePerWattSpare: plan.planPricePerWattSpare  //整个方案瓦单价（含备品备件）
    })
  }
  return r
}
/**
 * 计算立柱平均埋深，每MW立柱数量，立柱总数量，每100m瓦单价
 * @param plan
 */

function getPileMeterPrice(priceMsg, section, material) {
  const list = priceMsg || []
  const price = list.find(m => m.productCode === section && m.material && m.material.includes(material))
  if (!price || price.unitPrice == null || !price.lenth) {
    return 0
  }
  return 1000 * price.unitPrice / price.lenth || 0
}

function planPileInfoMsg(plan) {
  // console.log('function planPostMsg(plan)=============================================')
  // console.log(plan.trackersInfo[0].trackerPostInfoList)
  let priceMsg = plan.priceMsg || []
  let r = []
  ;(plan.trackersInfo || []).forEach(t => {
    let track_pile_info = []
    const postList = t.trackerPostInfoList || t.post_info_lst || []
    postList.forEach(p => {
      if(p.pile_type === 0){
        let a = {
          pile_type: '桩柱一体',
          category: p.category,  //驱动/非驱动
          position: p.position,
          section: p.section,
          material: p.material,
          depth: p.pile_obj && p.pile_obj.pile_depth != null ? p.pile_obj.pile_depth : 0,
          num: 1,
          pile_meter_price: getPileMeterPrice(priceMsg, p.section, p.material)
        }
        track_pile_info.push(a)
      } else if(p.pile_type === 3){
        console.log('p.pile_obj',p.pile_obj)
        let a = {
          pile_type: '钢桩',
          category: p.category,  //驱动/非驱动
          position: p.position,
          section: p.pile_obj.pile_body.section,
          material: p.pile_obj.pile_body.material,
          depth: p.pile_obj && p.pile_obj.pile_body ? p.pile_obj.pile_body.length : 0,
          num: 1,
          pile_meter_price: getPileMeterPrice(priceMsg, p.pile_obj.pile_body.section, p.pile_obj.pile_body.material)
        }
        track_pile_info.push(a)
      } else {
        let a = {
          pile_type: p.pile_type === 1 ? '地脚螺栓' : 'PHC管桩',
          category: p.category,  //驱动/非驱动
          position: p.position,
          section: '',
          material: '',
          depth: 0,
          num: 1,
          pile_meter_price: 0       
        }
        track_pile_info.push(a)
      }
    })
    const pileCount = track_pile_info.length
    const avgDepth = pileCount ? track_pile_info.reduce((a, b) => a + b.depth * 1, 0) / pileCount : 0
    const avgMeterPrice = pileCount ? track_pile_info.reduce((a, b) => a + b.pile_meter_price * 1, 0) / pileCount : 0
    const trackerCapacity = t.trackerCapacity || 0
    r.push({
      id: t.id,
      trackBrifeName: t.trackBrifeName,
      trackerNum: t.trackerNum,
      trackerCapacity: t.trackerCapacity,
      trackerPileInfoList: track_pile_info,
      //单个支架的桩的总数量
      trackerPileNum: track_pile_info.reduce((a,b) => a + b.num*1, 0),
      //该类型支架桩总数量
      trackerPileTotalNum:  track_pile_info.reduce((a,b) => a + b.num*1, 0)*t.trackerNum,
      //桩的平均深度
      trackerPileAverageDepth: avgDepth,
      //桩的平均单米价格
      trackerPileAveragePrice: avgMeterPrice,
      //10厘米价格
      trackerPileAveragePricePer10cm: avgMeterPrice / 10,
      //桩的瓦单价
      trackerPileAveragePricePerWatt: trackerCapacity ? avgMeterPrice / trackerCapacity : 0,
      //桩的类型(拼接并去重)
      trackerPileType: Array.from(new Set(track_pile_info.map(m => m.pile_type))).join(','),
    })
  })
  console.log('r===================================================')
  console.log(r)
  return r
}

function planTrackerCorrosionInfoMsg(plan) {
  let r = []
  ;(plan.trackersInfo || []).forEach(t => {
    console.log('t',t)
    //螺栓防腐处理
    let boltSurfaceTreatment = t.bolt_surface_treatment
    if(t.corrosion_proofing_grade === 'C3'){
      boltSurfaceTreatment = "热镀锌平均≥50μm"
    }else if(boltSurfaceTreatment === 'C4'){
      boltSurfaceTreatment = "热镀锌平均≥55μm"
    }else if(boltSurfaceTreatment === 'C5'){
      boltSurfaceTreatment = "锌镍合金"
    }else{
      boltSurfaceTreatment = "热镀锌平均≥50μm"
    }
    
    r.push({
      id: t.id,
      trackBrifeName: t.trackBrifeName,
      trackerNum: t.trackerNum,
      corrosionProofingGrade: t.corrosion_proofing_grade,
      postGalvanizinThickness: "热镀锌,平均厚度大于"+t.post_galvanizin_thickness+"μm",
      beamGalvanizinThickness: "锌铝镁,平均厚度大于"+t.beam_galvanizin_thickness+"μm",
      purlinGalvanizinThickness: "锌铝镁,平均厚度大于"+t.purlin_galvanizin_thickness+"μm",
      boltSurfaceTreatment: boltSurfaceTreatment,
      beamBrand: t.beam_brand,
      purlinBrand: t.purlin_brand,
      productSystem: t.product_system
    })
  })
  return r
}
function planTrackerGeometryInfoMsg(plan) {
  let r = []
  ;(plan.trackersInfo || []).forEach(t => {
    r.push({
      id: t.id,
      trackBrifeName: t.trackBrifeName,
      trackerNum: t.trackerNum,
      panelLength : t.panelLength,
      panelWidth: t.panelWidth,
      panelThickness: t.panelThickness,
      panelWeight: t.panelWeight
    })
  })
  return r
}
//将立柱信息转为可统计的信息
function getPileObj(postInfo, trackerNum,trackerCapacity) {
  let pile_type = postInfo.pile_type
  let depth = 0
  let section = ''
  let material = ''

  // pile_type 为 1 和 2 时，没有桩，不考虑
  if (pile_type === 0) {
    depth = +postInfo.pile_obj.pile_depth
    section = postInfo.section
    material = postInfo.material
  }
  if (pile_type === 3) {
    depth = +postInfo.pile_obj.pile_body.length
    section = postInfo.pile_obj.pile_body.section
    material = postInfo.pile_obj.pile_body.material
  }
  return { num: +trackerNum, pile_type: pile_type, depth: depth, section: section, material: material, trackerCapacity: trackerCapacity }
}

function unitPrice(priceMethod, costPrice, unitWeight) {
  if (priceMethod === '按件' || priceMethod === '按单件') {
    return costPrice
  }
  if (priceMethod === '按吨重') {
    return 0.001 * costPrice * unitWeight
  }
  return 0
}

function getSparePartRatio(spareParts, priceId) {
  // ['01-减速机', '02-控制系统', '03-阻尼', '04-立柱', '05-主梁', '06-檩条', '07-冲压件', '08-铸造件', '09-紧固件', '20-其它']
  let a = priceId.slice(0, 2)
  if (a === '01' || a === '02' || a === '03') {
    return spareParts.electricalMechanical
  }
  if (a === '04') {
    return spareParts.post
  }
  if (a === '05') {
    return spareParts.beam
  }
  if (a === '06') {
    return spareParts.purlin
  }
  if (a === '07' || a === '08') {
    return spareParts.standard
  }
  if (a === '09') {
    return spareParts.fasten
  }
  if (a === '20') {
    return spareParts.other
  }
  return 0
}

//生成价格表
function priceTable(objs) {
  let newObj = objs.map(m => {
    return {
      priceId: m.priceId,
      costPrice: m.costPrice,
      systemPrice: m.systemPrice,
      material: m.material,
      name: m.name,
      partNo: m.partNo,
      lenth: m.length,
      priceDetail: m.priceDetail,
      priceDetailObj: m.priceDetailObj,
      priceMethod: m.priceMethod,
      processSite: m.processSite,
      productCategory: m.productCategory,
      productCode: m.productCode,
      specification: m.specification,
      surfaceTreatment: m.surfaceTreatment,
      unit: m.unit,
      unitWeight:m.unitWeight,
      unitPrice: m.unitPrice,
      weightPerMater: m.weightPerMater,
      totalAmount: objs.filter(t => t.priceId === m.priceId).reduce((a, b) => a + 1 * b.amount * b.trackerNum, 0)
    }
  })
  newObj.forEach(m => m.totalPrice = m.totalAmount * m.unitPrice)  //写上总价
  //排序
  newObj = Array.from(new Set(newObj.map(m => JSON.stringify(m)))).map(m => JSON.parse(m)).sort((a, b) => {
    if (+a.priceId.slice(0, 2) > +b.priceId.slice(0, 2)) {
      return 1
    }
    if (+a.priceId.slice(0, 2) < +b.priceId.slice(0, 2)) {
      return -1
    }
    if (+a.priceId.slice(0, 2) === +b.priceId.slice(0, 2)) {
      //同类产品，价格高的在前
      if (+a.costPrice >= +b.costPrice) {
        return -1
      }
      return 1
    }
  })

  return newObj
}

//将价格明细转为对象
function getObjCostDetail(costPrice, costStr, adjust) {
  let obj = {
    name: name,  // 材料名称
    rawFee: 0,  //默认为总价（按件考虑时，原材料价就是总价）
    utilizationRate: 1,
    surfaceFee: 0,
    processingFee: 0,
    packagingFee: 0
  }
  //如果有调价信息，则写入
  if (adjust !== undefined) {
    adjust.forEach(a => {
      let aLocal = 1 * a.create_time + 0 * 3600 * 1000
      let dateTime = myUtils.getDateToString(new Date(aLocal))
      a.create_time_local = dateTime
    })
    obj.adjustMsg = adjust
  }
  costStr = costStr.replace('{', '').replace('}', '').replace(' ', '') + ','
  if (costStr.includes('rmp:')) {
    obj.rawFee = costStr.split('rmp:')[1].split(',')[0]
  }  //原材料价格
  if (costStr.includes('utr:')) {
    obj.utilizationRate = costStr.split('utr:')[1].split(',')[0]
  }  //利用率
  if (costStr.includes('sft:')) {
    obj.surfaceFee = costStr.split('sft:')[1].split(',')[0]
  }  //表面处理费
  if (costStr.includes('psf:')) {
    obj.processingFee = costStr.split('psf:')[1].split(',')[0]
  }  //加工费
  if (costStr.includes('pkf:')) {
    obj.packagingFee = costStr.split('pkf:')[1].split(',')[0]
  }  //包装费
  return obj
}



