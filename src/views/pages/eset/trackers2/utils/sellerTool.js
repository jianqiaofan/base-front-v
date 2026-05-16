import { getTrackerCategroyA } from '@/views/pages/eset/trackers2/utils/classPlan'
import priceAdjust from '@/views/pages/eset/trackers2/PriceAdjust.vue'
import { off } from 'element-ui'

function getSummaryCostAndWeight(plan, priceAdjust,who_adjust) {
  console.log('###plan', plan)
  console.log('###price', priceAdjust)
  let priceAdjustFactor = {};
  for (const item of priceAdjust) {
    if (item.who_adjust=== who_adjust) {
      priceAdjustFactor = item.adjust_price_details;
      break;
    }
  }
  let rObj = []
  const tracker_arr = plan.trackersInfo
  for (const item of tracker_arr) {
    const bomData = item.resultList.bom1
    const quantity = 1*item.trackerNum;
    const capacity = item.pv_capacity * item.solar_num;
    const trickerPrice = getTrakcerPrice(bomData,priceAdjustFactor);  //单个支架的总价
    const trickerPriceNonStructure = getTrakcerPriceNoStructure(bomData,priceAdjustFactor);  //单个支架非结构构件总价
    const totalWeightStructure = getTrakcerStractureWeight(bomData);  //结构件总价
    const totalWeightNonStructure = getTrakcerNonStractureWeight(bomData);  //非结构件总价
    let obj = {
      id: item.trackBrifeName,
      quantity: quantity,
      capacity: 0.001*item.trackerNum * capacity/1000,
      trackerPrice: trickerPrice,
      proportion: 0,
      pricePreWatt: trickerPrice / capacity,  //瓦单价
      weightAll: (totalWeightStructure+totalWeightNonStructure) * quantity,
      weightStructureOnly: totalWeightStructure * quantity,
      ton_price_structure: trickerPrice-trickerPriceNonStructure//(结构件综合吨价)结构件总重除以结构件总价
    }
  rObj.push(obj)
  }

  let planTotalPrice = 0;//整个方案所有支架的总价
  for (const item of rObj) {
    planTotalPrice += 1.0*item.oneTrackerPrice * item.quantity;
  }

  //计算占比
  for (const item of rObj) {
    item.proportion = 1.0*item.oneTrackerPrice * item.quantity/planTotalPrice;
  }
  console.log('rObj',rObj)
  return rObj
}

//按人民币计价，由单个tracker的总价
function getTrakcerPrice(bom,adjust,capacityAdjustRatio) {
  if(capacityAdjustRatio === undefined){
    capacityAdjustRatio=1.0
  }
  let totalPrice = 0;
  for (const b of bom) {
    //只有立柱、主梁和檩条才考虑容量调整系数
    if (b.priceId.slice(0, 2) !== '04' && b.priceId.slice(0, 2) !== '05' && b.priceId.slice(0, 2) !== '06'){
      capacityAdjustRatio = 1.0
    }
    let costPrice = 1*b.costPrice;
    if(b.priceId in adjust){
      costPrice = getPriceByDetail(adjust[b.priceId]);  //调整后的价格
      // console.log('adjust[b.priceId]',adjust[b.priceId],cost)
    }
    if(b.priceMethod === '按吨重'){
      totalPrice += capacityAdjustRatio * 1 * b.amount * costPrice * b.unitWeight / 1000
    }else{
      totalPrice += 1 * b.amount * costPrice
    }
  }
  return totalPrice
}

//一个支架中非结构构件的总价
function getTrakcerPriceNoStructure(bom,adjust) {
  let totalPrice = 0;
  for (const b of bom) {
    let costPrice = 1*b.costPrice
    if(
      b.priceId.slice(0,2) === '01' ||
      b.priceId.slice(0,2) === '02' ||
      b.priceId.slice(0,2) === '03' ||
      b.priceId.slice(0,2) === '20'
    ){
      if(b.priceId in adjust){
        costPrice = getPriceByDetail(adjust[b.priceId]);  //调整后的价格
      }
      if(b.priceMethod === '按吨重'){
        totalPrice += 1 * b.amount * costPrice * b.unitWeight / 1000
      }else{
        totalPrice += 1 * b.amount*costPrice
      }
    }

  }
  return totalPrice
}

// let category = ['01-减速机', '02-控制系统', '03-阻尼', '04-立柱', '05-主梁', '06-檩条', '07-冲压件', '08-铸造件', '09-紧固件', '20-其它']
//计算支架结构构件重量
function getTrakcerStractureWeight(bom) {
  let weight = 0;
  for (const b of bom) {
    // console.log(b.priceId)
    if(
      b.priceId.slice(0,2) === '04' ||
      b.priceId.slice(0,2) === '05' ||
      b.priceId.slice(0,2) === '06' ||
      b.priceId.slice(0,2) === '07' ||
      b.priceId.slice(0,2) === '08' ||
      b.priceId.slice(0,2) === '09'
    ){
      weight += 1 * b.amount * b.unitWeight
    }
  }
  return weight
}

//计算支架非结构构件重量
function getTrakcerNonStractureWeight(bom) {
  let weight = 0;
  for (const b of bom) {
    if(
      b.priceId.slice(0,2) === '01' ||
      b.priceId.slice(0,2) === '02' ||
      b.priceId.slice(0,2) === '03' ||
      b.priceId.slice(0,2) === '20'
    ){
      weight += 1 * b.amount * b.unitWeight
    }
  }
  return weight
}


function getPriceByDetail(priceDetail){
  const pd = priceDetail;
  const price = (1 * pd.rmp / pd.utr + 1 * pd.psf
    + 1 * pd.sft + 1 * pd.pkf + 1 * pd.dfc - 1 * pd.exr + 1 * pd.imt + 1 * pd.ocf)  //调整后的价格
  return price
}

function str2num(s){
  return 0
}

export { getSummaryCostAndWeight,getTrakcerPrice }
