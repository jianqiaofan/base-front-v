// import { getToken } from '@/utils/auth'
//
// const api_name = '/eset/trackerIndex.js'
// export default {
//   //读取txt文件内容
//   getTextFileContent(file) {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         if (file.raw) {
//           resolve(e.target.result) // 当文件读取成功时，解析Promise并返回文件内容
//         }
//       }
//       reader.onerror = (e) => {
//         reject(e.target.error) // 如果发生错误，拒绝Promise
//       }
//       reader.readAsText(file.raw) // 开始异步读取文件内容
//     })
//   },
//
//   //txt文件数据清理
//   fileDataCleaning(inputStr) {
//     inputStr = inputStr
//       .replaceAll('\r', '').replaceAll('\n', '')
//       .replaceAll(' ', '')
//       .replaceAll('"', '\'')
//     return inputStr
//   },
//
//   //将结构计算软件中导出的文本转化为
//   //这个基本上不用了
//   trackStr2Obj(fileName, trackerPos, commonInfo, strackerInfo, initInfo) {
//     let cif = commonInfo.replaceAll(' ', '').replaceAll('\'', '').replaceAll('\n', '')  //通用信息字符串
//     let sif = strackerInfo.replaceAll(' ', '').replaceAll('\'', '').replaceAll('\n', '')   //外或边或内字符串
//     let h_post = sif.split('h_post:')[1].split('}')[0]  //柱子高度
//
//     let post_info = sif.split('post_info_lst:')[1].replace('[[', '').split(']],')[0].split('],[')  //立柱信息列表
//     let post_info_lst = []
//     let drive_post = []  //用于记录驱动立柱位置，后面要用
//     let post_position = []  //用于记录所有立柱的位置（方便后继主梁分段）
//
//     //post 对象内容 ：位置，截面，材质，高度，类别（非驱动/驱动）
//     for (let i = 0; i < post_info.length; i++) {
//       let ar = post_info[i].split(',')
//       post_position.push(ar[0])
//       if (ar[1].startsWith('t')) {
//         drive_post.push(ar[0] * 1)
//       }  //保存到驱动立柱数组
//       let f = {
//         position: ar[0],
//         category: ar[1].startsWith('t') ? '驱动' : '非驱动',
//         material: ar[2],
//         section: ar[3],
//         height: h_post,  //柱子高度
//         pileType: 0,    //基础类型
//         pileDepth: 1500,  //桩埋深
//         fweight_factor: 1.0  //法兰重量修正系数
//       }
//       post_info_lst.push(f)
//     }
//
//     //处理梁信息
//     let beam_length = sif.split('l_beam:')[1].split(',')[0] //主梁总长
//     let d = sif.split('beam_divide_info_lst:')[1].replace('[[', '').split('],')
//     let d0 = d[0] + ','  //主梁分段
//     let d1 = d[1]    //主梁厚度
//     let d2 = d[2].replaceAll('\'', '')  //截面类型，材质，尺寸
//     //将头尾多余字符去掉
//     d0 = d0.endsWith(',') ? d0.slice(0, -1) : d0
//     d1 = d1.replaceAll('[', '').replaceAll(']', '')
//
//     //主梁分段逻辑
//     //如果是Diamond截面，分段点取立柱断点(不影响报价)；
//     let beam_divide = []
//     if (d2.includes('Diamond')) {
//       beam_divide = post_position//用立柱点来打断梁
//       beam_divide.unshift('0')  //加上梁起点
//       beam_divide.push(beam_length)  //加上梁终点
//     }
//
//     //八角型主梁时，分段点以驱动立柱分一次，然后以不超过12.5米（运输要求）分段，分段数影响报箍数量
//     if (d2.includes('Octagon')) {
//       let b = drive_post//驱动立柱上一定有断点
//       b.unshift(0)  //加上梁起点
//       b.push(beam_length * 1)  //加上梁终点
//
//       // beam_divide.push(0);
//       //其它区间段，大于12.5米时平均分段
//       let allowLength = 12500
//       for (let i = 0; i < b.length - 1; i++) {
//         const element = b[i + 1] * 1 - b[i] * 1
//         if (element > allowLength) {
//           for (let j = 2; j < 20; j++) {
//             let segmentation = j
//             if (element / j < allowLength) {
//               segmentation = j  //记录分段数量
//               if (i === 0 || i === b.length - 2) {
//                 segmentation = segmentation - 1
//               }
//               // console.log('分段数',j)
//             }
//             for (let k = 0; k < segmentation + 1; k++) {
//               beam_divide.push(Math.floor((b[i] * 1 + k * (element / (segmentation + 1)))).toString())
//             }
//             break
//           }
//         } else {
//           beam_divide.push(b[i])
//         }
//       }
//       beam_divide.push(beam_length)    //加上最后个端点
//       b.shift(0)  //驱动立柱减去梁起点
//       b.pop()  //驱动立柱加上梁终点
//     }
//
//     //'Diamond', 'S500GD', '134'
//     let beam_material = d2.split(',')[1]
//     let beam_section_type = d2.split(',')[0]  //截面类型  Diamond 或 Octagon
//     let beam_section_dim = d2.split(',')[2]  //主梁截面尺寸
//     let section = d2.split(',')[0] + '-' + d2.split(',')[2]
//
//     // d0 = '0,' + d0 + ',' + beam_length;
//     let arr = beam_divide
//     let arrBeamDivide = d0.split(',')  //从软件导出的原始的段点
//     let arrThickness = d1.split(',')  //从软件导出的原始的厚度,数组的长度比arrBeamDivide多1个
//     let beam_info_lst = []
//
//     //beam 对象内容 ：起点，终点，截面，材质，长度，类别（中间主梁/驱动主梁/端部主梁）
//     for (let i = 1; i < arr.length; i++) {
//       let cg = '中间1主梁'
//       if (i == 1 || i == arr.length - 1) {
//         cg = '端部2主梁'
//       }  //判断端梁
//       //判断驱动主梁
//       if (drive_post.includes(arr[i - 1] * 1) || drive_post.includes(arr[i] * 1)) {
//         cg = '驱动主梁'
//       }    //驱动立柱点就是梁的断点的情况
//       let f = {
//         start: arr[i - 1],
//         end: arr[i],
//         section: section + 'x' + this.getThickness(arrBeamDivide, arrThickness, arr[i - 1] * 1, arr[i] * 1),
//         material: beam_material,
//         length: arr[i] * 1 - arr[i - 1] * 1,
//         category: cg
//       }
//       beam_info_lst.push(f)
//     }
//
//     let pv_list = sif.split('solar_list:[')[1].split('],')[0].split(',')//光伏板排布
//     console.log("pv_list===========================",pv_list)
//     let purlinCount = 0  //檩条根数
//     pv_list.forEach(element => {
//       purlinCount += element * 1 + 1
//     })
//
//     //显示行的颜色
//     let rowColor = ''
//     let purlinObj = []
//     if (trackerPos == 'Exterior') {
//       // rowColor="red"
//       rowColor = '#FF3366'
//       purlinObj = [{ id: 0, material: 'S420GD', section: '-1.5x30x30x60', length: 1450, amount: purlinCount }]
//     }
//     if (trackerPos == 'Edge') {
//       // rowColor="yellow"
//       rowColor = '#FFFFCC'
//       Math.floor(purlinCount * 0.3)
//       purlinObj = [{
//         id: 0,
//         material: 'S420GD',
//         section: '-1.5x30x30x60',
//         length: 1450,
//         amount: Math.floor(purlinCount * 0.3)
//       },
//         {
//           id: 1,
//           material: 'S420GD',
//           section: '-1.5x30x30x60',
//           length: 450,
//           amount: purlinCount - Math.floor(purlinCount * 0.3)
//         }]
//     }
//     if (trackerPos == 'Interior') {
//       rowColor = '#33FF99'
//       // rowColor="green"
//       purlinObj = [{ id: 0, material: 'S420GD', section: '-1.5x30x30x60', length: 450, amount: purlinCount }]
//     }
//
//     let strs = cif.split('bb')[1].split(',')[0].replaceAll('\'', '').replaceAll(':', '')    //组件串数
//     let h_min = cif.split('h_min')[1].split(',')[0].replaceAll('\'', '').replaceAll(':', '')    //最小离地高度
//     let pv_iftp = cif.split('tp')[1].split(',')[0].replaceAll('\'', '').replaceAll(':', '').replaceAll('}', '')   //光伏板是否通铺
//     //将以上数据封装成对象数组
//     let r = {
//       id: fileName + '-' + trackerPos,  //文件名称+‘-’+支架所在位置
//       trackerNum: 1,  //支架数量
//       trackerRatio: 0, //支架占总支架数量比
//
//       trackBrifeName: trackerPos + '-' + strs + 'strs',    //支架简称，位置+串数
//       pvStringNum: strs,//组件的串数
//
//       trackerPos: trackerPos,  //支架在外、边或内
//       rowColor: rowColor,//行的颜色，区分内外围用,外边内分别为红黄绿
//       showPostBeamTable: false,  //默认是否展开梁柱明细表
//       ifCalculated: false,  //是否已完成计算
//
//       corrosion_proofing_grade: initInfo.corrosion_proofing_grade,
//       post_galvanizin_thickness: initInfo.post_galvanizin_thickness,
//       beam_galvanizin_thickness: initInfo.beam_galvanizin_thickness,
//       purlin_galvanizin_thickness: initInfo.purlin_galvanizin_thickness,
//       beam_brand: initInfo.beam_brand,
//       purlin_brand: initInfo.purlin_brand,
//       product_system: initInfo.product_system,
//       slew_drive_inch: initInfo.slew_drive_inch,
//       slew_cover_if_need: initInfo.slew_cover_if_need,    //是否需要减速机罩
//       dumper_num: initInfo.dumper_num,
//       dumper_type: initInfo.dumper_type,
//       power_supply: initInfo.power_supply,
//       post_type: initInfo.post_type,  //柱子大体上的类型  (在大面积输入时起作用)
//       post_depth: initInfo.post_depth,//柱子大体上埋深
//       fweight_factor: initInfo.fweight_factor,  //大体上带法兰立柱的法兰重量调整系数
//
//       purlin_info_lst: purlinObj,  //初始化一个檩条列表
//       pv_length: cif.split('length1:')[1].split(',')[0],  //光伏板长
//       pv_width: cif.split('width1:')[1].split(',')[0],  //光伏板宽
//       pv_thickness: cif.split('mkg:')[1].split(',')[0], //可能是板重量
//       solar_list: pv_list,  //光伏板排布
//       solar_num: pv_list.reduce((prev, cur) => prev + cur * 1, 0),  //一个支架光伏板的块数
//       pv_capacity: initInfo.pv_capacity,  //光伏板容量(W) 默认630
//
//       tracker_capacity: 0,  //单个支架的容量
//       total_tracker_capacity: 0,  //该种支架全部容量
//       tracker_weight: 0,  //单个支架重量
//       total_tracker_weight: 0,  //多个支架总重
//
//       trackerPrice: 0,  //单个支架的价格(不含备品备件)
//       trackerTotalPrice: 0,  //该种支架总的的价格(不含备品备件)
//       pricePerWatt: 0,  //瓦单价(不含备品备件)
//
//       trackerPriceWithSpareParts: 0,  //单个支架的价格(含备品备件)
//       trackerTotalPriceWithSpareParts: 0,  //该种支架总的的价格(含备品备件)
//       pricePerWattWithSpareParts: 0,  //瓦单价(含备品备件)
//
//       slew_count: pv_list.length - 1,  //减速机个数
//       master_controlor: pv_list.length - 1,  //主控制器个数
//       server_controlor: pv_list.length - 2,  //从控制器个数
//       purlinCount: purlinCount,
//       dis: cif.split('dis:')[1].split(',')[0],    //双联排时，用于计算连接杆的长度
//       layout: cif.split('pp:')[1].split(',')[0],    //1P或2P
//       post_height: h_post,  //柱子高度
//       h_min: h_min,  //最小离地高度
//       pv_iftp: pv_iftp,  //光伏板是否通铺
//       beam_length: beam_length,  //主梁总长
//       post_info_lst: post_info_lst,  //立柱信息列表
//       drive_post: drive_post,  //驱动立柱信息
//       beam_info_lst: beam_info_lst,  //主梁信息列表
//       beam_section_dim: beam_section_dim,  //主梁截面尺寸
//       beam_section_type: beam_section_type,  //主梁类型
//       resultList: []    //存放Bom表数据
//
//     }
//     return r
//   },
//
//   //根据位置确定柱子厚度
//   getThickness(arrBeamDivide, arrThickness, startPoint, endPoint) {
//     let thickness = arrThickness.slice(-1)  //默认值取最后一个
//     for (let i = 0; i < arrBeamDivide.length; i++) {
//       const element = arrBeamDivide[i] * 1
//       //当点在梁上时，得到厚度
//       if (element > startPoint && element <= endPoint) {
//         thickness = arrThickness[i]
//         break
//       }
//     }
//     return thickness
//   },
//
//   //传入完整的plan对象,计算内部元素并刷新
//   refreshModuleData(md) {
//     let sparePartsList = md.spareParts
//     let totalTrackerNum = 0 //全部支架总数
//     for (let i = 0; i < md.trackersInfo.length; i++) {
//       totalTrackerNum += md.trackersInfo[i].trackerNum * 1
//     }
//     md.weatherStationTotalPrice = md.weatherStationNum*md.weatherStationUnitPrice  //计算气象站总价
//     totalTrackerNum = totalTrackerNum >= 1 ? totalTrackerNum : 1
//     md.trackersInfo.forEach((t) => {
//       let totalPVCapacity = t.pv_capacity * t.solar_num  //支架总容量
//       totalPVCapacity = totalPVCapacity === 0 ? 1 : totalPVCapacity  //防止被0除
//       t.trackerRatio = (100 * t.trackerNum / totalTrackerNum).toFixed(2)
//       t.tracker_capacity = (totalPVCapacity / 1000).toFixed(3)  //单个支架的容量
//       t.total_tracker_capacity = (t.trackerNum * totalPVCapacity / 1000).toFixed(2)  //该种支架全部容量
//
//       t.tracker_weight = this.getTrackerWeight(t.resultList.bom1, t.resultList.bom2, t.resultList.bom3)  //单个支架重量
//       t.total_tracker_weight = (t.tracker_weight * t.trackerNum).toFixed(3)  //单个支架重量
//       //单个支架(不含备品备件)
//       t.trackerPrice = this.getTrackerPrice(t.resultList.bom1, t.resultList.bom2, t.resultList.bom3)  //单个支架的价格(不含备品备件)
//       t.trackerTotalPrice = (t.trackerPrice * t.trackerNum).toFixed(2)  //该种支架总的的价格(不含备品备件)
//       t.pricePerWatt = (t.trackerPrice / totalPVCapacity).toFixed(3)  //瓦单价(不含备品备件)
//
//       //单个支架(含备品备件)
//       t.trackerPriceWithSpareParts =
//         this.getTrackerPriceWithSpareParts(sparePartsList, t.resultList.bom1, t.resultList.bom2, t.resultList.bom3)  //单个支架的价格(含备品备件)
//       t.trackerTotalPriceWithSpareParts = (t.trackerPriceWithSpareParts * t.trackerNum).toFixed(2)  //该种支架总的的价格(含备品备件)
//       t.pricePerWattWithSpareParts = (t.trackerPriceWithSpareParts / totalPVCapacity).toFixed(3)  //瓦单价(含备品备件)
//     })
//     return md
//   },
//   //计算支架总重
//   getTrackerWeight(bom1, bom2, bom3) {
//     let bom = [...bom1, ...bom2, ...bom3]
//     let weight = 0
//     bom.forEach((t) => {
//       weight += t.totalWeight * 1
//     })
//     return weight.toFixed(3)
//   },
//
//   //计算单套支架价格
//   getTrackerPrice(bom1, bom2, bom3) {
//     let bom = [...bom1, ...bom2, ...bom3]
//     let price = 0
//     bom.forEach((t) => {
//       price += t.totalPrice * 1
//     })
//     return price.toFixed(4)
//   },
//
//   //价格分类列表1:按立柱，主梁，檩条，标准件，紧固件，电气&机械,其它等分类方式维度计算
//   getPriceListCategory1(spareParts, bom1, bom2, bom3) {
//     let bom = [...bom1, ...bom2, ...bom3]
//     let price_post = 0
//     let price_beam = 0
//     let price_purlin = 0
//     let price_standard = 0
//     let price_fasten = 0
//     let price_electricalMechanical = 0
//     let price_other = 0
//
//     for (let i = 0; i < bom.length; i++) {
//       if (bom[i].productCategory === 'H型钢') {
//         price_post = price_post + bom[i].totalPrice
//       } else if (bom[i].productCategory === '主梁') {
//         price_beam = price_beam + bom[i].totalPrice
//       } else if (bom[i].productCategory === '檩条') {
//         price_purlin = price_purlin + bom[i].totalPrice
//       } else if (bom[i].productCategory === '标准件') {
//         price_standard = price_standard + bom[i].totalPrice
//       } else if (bom[i].productCategory === '紧固件') {
//         price_fasten = price_fasten + bom[i].totalPrice
//       } else if (bom[i].productCategory === '电气&机械') {
//         price_electricalMechanical = price_electricalMechanical + bom[i].totalPrice
//       } else {
//         price_other = price_other + bom[i].totalPrice
//       }
//     }
//
//     return {
//       price_post: price_post * (1 + 0.01 * spareParts.post),
//       price_beam: price_beam * (1 + 0.01 * spareParts.beam),
//       price_purlin: price_purlin * (1 + 0.01 * spareParts.purlin),
//       price_standard: price_standard * (1 + 0.01 * spareParts.standard),
//       price_fasten: price_fasten * (1 + 0.01 * spareParts.fasten),
//       price_electricalMechanical: price_electricalMechanical * (1 + 0.01 * spareParts.electricalMechanical),
//       price_other: price_other * (1 + 0.01 * spareParts.other)
//     }
//   },
//
//   //计算单套支架价格
//   getTrackerPriceWithSpareParts(spareParts, bom1, bom2, bom3) {
//     let r = this.getPriceListCategory1(spareParts, bom1, bom2, bom3)
//     let price = 0
//     price = r.price_post + r.price_beam + r.price_purlin + r.price_standard
//       + r.price_fasten + r.price_electricalMechanical + r.price_other
//     return price.toFixed(4)
//   },
//
//   //第二种分类计算componets分类
//   //Drives System,Control system,Damper,Post,Torque Tube,Purlin,Stamping Part,Casting Part,Fastners,Others
//   //1-Cost Per Tracker(RMB)           2-Cost Per Watt(RMB)	       3-Cost Percentage
//   //4-Weight total Tracker(Kg)	      5-Weight Per MW	             6-Weight Percentage
//   categoryComponets(md) {
//     let trackerTables = []   //所有的tracker的数据都在这里面，一个tracker一张表
//     for (let i = 0; i < md.trackersInfo.length; i++) {
//       let t = md.trackersInfo[i]
//       let drives_system = []
//       let control_system = []
//       let damper = []
//       let post = []
//       let torque_tube = []
//       let purlin = []
//       let stamping_parts = []
//       let casting_part = []
//       let fastners = []
//       let others = []
//       //分类
//       let bom = [...t.resultList.bom1, ...t.resultList.bom2, ...t.resultList.bom3]
//       bom.forEach(b => {
//         if (b.componets === null) {
//           b.componets = ''
//         }  //null没有toLowerCase()方法
//         if (b.componets.toLowerCase() === 'drives system') {
//           drives_system.push(b)
//         } else if (b.componets.toLowerCase() === 'control system') {
//           control_system.push(b)
//         } else if (b.componets.toLowerCase() === 'damper') {
//           damper.push(b)
//         } else if (b.componets.toLowerCase() === 'post') {
//           post.push(b)
//         } else if (b.componets.toLowerCase() === 'torque tube') {
//           torque_tube.push(b)
//         } else if (b.componets.toLowerCase() === 'purlin') {
//           purlin.push(b)
//         } else if (b.componets.toLowerCase() === 'stamping part') {
//           stamping_parts.push(b)
//         } else if (b.componets.toLowerCase() === 'casting part') {
//           casting_part.push(b)
//         } else if (b.componets.toLowerCase() === 'fastners') {
//           fastners.push(b)
//         } else {
//           others.push(b)
//         }  //others
//       })
//       console.log('purlin.length', purlin.length)
//       //计算数据
//       let objDrivesSystem = this.getComponetParams(drives_system, t.trackerPrice, t.tracker_capacity, t.tracker_weight)
//       let objDontrolSystem = this.getComponetParams(control_system, t.trackerPrice, t.tracker_capacity, t.tracker_weight)
//       let objDamper = this.getComponetParams(damper, t.trackerPrice, t.tracker_capacity, t.tracker_weight)
//       let objPost = this.getComponetParams(post, t.trackerPrice, t.tracker_capacity, t.tracker_weight)
//       let objTorqueTube = this.getComponetParams(torque_tube, t.trackerPrice, t.tracker_capacity, t.tracker_weight)
//       let objPurlin = this.getComponetParams(purlin, t.trackerPrice, t.tracker_capacity, t.tracker_weight)
//       let objStampingParts = this.getComponetParams(stamping_parts, t.trackerPrice, t.tracker_capacity, t.tracker_weight)
//       let objcastingpart = this.getComponetParams(casting_part, t.trackerPrice, t.tracker_capacity, t.tracker_weight)
//       let objFastners = this.getComponetParams(fastners, t.trackerPrice, t.tracker_capacity, t.tracker_weight)
//       let objOthers = this.getComponetParams(others, t.trackerPrice, t.tracker_capacity, t.tracker_weight)
//
//       //加一行总数
//       let tempList = [objDrivesSystem, objDontrolSystem, objDamper, objPost, objTorqueTube, objPurlin,
//         objStampingParts, objcastingpart, objFastners, objOthers]
//       let tCpt = 0
//       tempList.forEach((o) => {
//         tCpt += o.costPerTracker
//       })
//       let tCpw = 0
//       tempList.forEach((o) => {
//         tCpw += o.costPerWatt
//       })
//       let tCp = 0
//       tempList.forEach((o) => {
//         tCp += o.costPercentage
//       })
//       let tWtt = 0
//       tempList.forEach((o) => {
//         tWtt += o.weightTotalTracker
//       })
//       let tWpm = 0
//       tempList.forEach((o) => {
//         tWpm += o.weightPerMw
//       })
//       let tWp = 0
//       tempList.forEach((o) => {
//         tWp += o.weightPercentage
//       })
//
//       let totalObj = {
//         costPerTracker: tCpt,
//         costPerWatt: tCpw,
//         costPercentage: tCp,
//         weightTotalTracker: tWtt,
//         weightPerMw: tWpm,
//         weightPercentage: tWp
//       }
//
//       let obj = {
//         tracker_name: t.trackBrifeName,
//         drives_system: objDrivesSystem,
//         control_system: objDontrolSystem,
//         damper: objDamper,
//         post: objPost,
//         torque_tube: objTorqueTube,
//         purlin: objPurlin,
//         stamping_parts: objStampingParts,
//         casting_part: objcastingpart,
//         fastners: objFastners,
//         others: objOthers,
//         total: totalObj
//       }
//       trackerTables.push(obj)
//     }  //fori
//     return trackerTables
//   },
//
//   //计算各参数
//   //1-Cost Per Tracker(RMB)           2-Cost Per Watt(RMB)	       3-Cost Percentage
//   //4-Weight total Tracker(Kg)	      5-Weight Per MW	             6-Weight Percentage
//   getComponetParams(bom, trackerTotalPrice, trackerTotalWatt, trakcerWeight) {
//     // console.log("=======",bom.length,trackerTotalPrice, trackerTotalWatt, trakcerWeight)
//     trackerTotalPrice = trackerTotalPrice === 0 ? 1 : trackerTotalPrice  //总价格
//     trackerTotalWatt = trackerTotalWatt === 0 ? 1 : trackerTotalWatt  //总瓦数
//     trakcerWeight = trakcerWeight === 0 ? 1 : trakcerWeight  //总重量
//     if (bom.length === 0) {
//       return {
//         costPerTracker: 0,
//         costPerWatt: 0,
//         costPercentage: 0,
//         weightTotalTracker: 0,
//         weightPerMw: 0,
//         weightPercentage: 0
//       }
//     }
//     let costPerTracker = 0
//     for (let i = 0; i < bom.length; i++) {
//       costPerTracker += bom[i].totalPrice
//     }
//     let weightTotalTracker = 0
//     for (let i = 0; i < bom.length; i++) {
//       weightTotalTracker += bom[i].totalWeight
//     }
//     let r = {
//       costPerTracker: costPerTracker,
//       costPerWatt: costPerTracker / trackerTotalWatt,
//       costPercentage: 100 * costPerTracker / trackerTotalPrice,
//       weightTotalTracker: weightTotalTracker,
//       weightPerMw: weightTotalTracker / trackerTotalWatt / 1000,
//       weightPercentage: 100 * weightTotalTracker / trakcerWeight
//     }
//     return r
//   },
//
//   //计算Componets总表
//   getComponetsTotalTable(singleTable) {
//     let r = []
//     let st = singleTable
//     let cobj = [
//       'drives_system', 'control_system', 'damper', 'post', 'torque_tube', 'purlin', 'stamping_parts', 'casting_part', 'fastners', 'others'
//     ]
//     for (let i = 0; i < cobj.length; i++) {
//
//       let componets = cobj[i]
//       let costPerTracker = this.aaa(st,componets,'costPerTracker')
//       let costPerWatt = this.aaa(st,componets,'costPerWatt')
//       let costPercentage = this.aaa(st,componets,'costPercentage')
//       let weightTotalTracker = this.aaa(st,componets,'weightTotalTracker')
//       let weightPerMw = this.aaa(st,componets,'weightPerMw')
//       let weightPercentage = this.aaa(st,componets,'weightPercentage')
//       let tariff = 100
//       weightTotalTracker = weightTotalTracker === 0 ? 1:weightTotalTracker
//       let rmbPerKg = costPerTracker/weightTotalTracker
//
//       let temo = {
//         rmbPerKg: rmbPerKg,
//         componets: componets,
//         costPerTracker: costPerTracker,
//         costPerWatt: costPerWatt,
//         costPercentage: costPercentage,
//         weightTotalTracker: weightTotalTracker,
//         weightPerMw: weightPerMw,
//         weightPercentage: weightPercentage,
//         tariff: tariff
//       }
//       r.push(temo)
//     }
//     return r
//   },
//
//   aaa(st,componetName,item){
//     let str = JSON.stringify(st)+','
//     let arr = str.split(componetName)
//     let n = 0;
//     for (let i = 1; i < arr.length; i++) {
//       let arr1 = arr[i].split(item)[1].split(',')[0]
//       let r = arr1.replaceAll(':','').replaceAll('{','').replaceAll('{','').replaceAll('"','')
//         n+=r*1
//     }
//     return !isNaN(n)?n:0
//   }
// }



