import { Tracker } from '@/views/pages/eset/trackers2/utils/classPlan.js'

export default {
  //读取txt文件内容
  getTextFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (file.raw) {
          resolve(e.target.result) // 当文件读取成功时，解析Promise并返回文件内容
        }
      }
      reader.onerror = (e) => {
        reject(e.target.error) // 如果发生错误，拒绝Promise
      }
      reader.readAsText(file.raw) // 开始异步读取文件内容
    })
  },

  //txt文件数据清理
  // fileDataCleaning(inputStr) {
  //   inputStr = inputStr
  //     .replaceAll('\r', '').replaceAll('\n', '')
  //     .replaceAll(' ', '')
  //     .replaceAll('"', '\'')
  //   return inputStr
  // },


  //将结构计算软件中导出的文本转化为
  trackStr2Obj(fileName, trackerPos, commonInfo, strackerInfo, initInfo) {
    console.log("================================================")
    console.log("fileName",fileName)
    console.log("trackerPos",trackerPos)
    console.log("commonInfo",commonInfo)
    console.log("strackerInfo",strackerInfo)
    console.log("initInfo",initInfo)
    // console.log("commonInfo",commonInfo)
    // console.log("strackerInfo",strackerInfo)
    let post_info_lst = []
    let post_position = []  //用于记录所有立柱的位置（方便后继主梁分段）

    //驱动位置数组
    let drive_post = strackerInfo.post_info_lst.filter(p => p[1].startsWith('t')).map(p => p[0])
    //处理梁信息
    const beam_length = strackerInfo.l_beam //主梁总长
    let d = strackerInfo.beam_divide_info_lst
    let b_thickness = d[1]    //主梁厚度列表
    let b_section_type = d[2] //截面类型
    let beam_divide
    if (b_section_type.includes('Octagon')) {
      beam_divide = drive_post.concat()  //8角型主梁，以驱动立柱为必然的分段点 .concat()是为了深拷贝
    } else {
      beam_divide = d[0]  //对于菱型主梁，所有的立柱为必然的分段点
    }
    let b_material = d[3] //材质
    let b_diameter = d[4] //截面尺寸

    let beam_info_lst = []  //beam 对象内容 ：起点，终点，截面，材质，长度，类别（中间主梁/驱动主梁/端部主梁）
    let beam_info_lst_1 = []  //beam 按立柱分段
    let beam_info_lst_2 = []  //beam 按12.5米分段

    //处理Diamond截面，分段点取立柱断点；fdsa
    if (b_section_type.includes('Diamond')) {
      beam_divide.unshift(0)  //加上梁起点
      beam_divide.push(beam_length)  //加上梁终点
      let arr = beam_divide
      for (let i = 0; i < arr.length - 1; i++) {
        let staPoint = arr[i]  //起点
        let endPoint = arr[i + 1]  //终点
        let section = 'Diamond-' + b_diameter + 'x' + b_thickness[i]
        let len = arr[i + 1] - arr[i] + 350  //350为插芯长度
        let cg = '中间主梁'
        if (i === 0 || i === arr.length - 2) {
          cg = '端部主梁'
        }
        if (drive_post.includes(arr[i] * 1) || drive_post.includes(arr[i + 1] * 1)) {
          cg = '驱动主梁'
        }

        let f = {
          start: arr[i],
          end: arr[i + 1],
          section: section,
          origin_section: section,//原始截面
          material: b_material,
          length: arr[i + 1] - arr[i],  //350为插芯在后台再考虑，这里强调几何数据
          category: cg
        }
        beam_info_lst_1.push(f)
      }
      beam_info_lst = beam_info_lst_1
    }

//八角型主梁时，分段点以驱动立柱分一次，然后以不超过12.5米（运输要求）分段，分段数影响报箍数量(两个驱动立柱之间至少有一个抱箍)
    if (b_section_type.includes('Octagon')) {
      beam_divide.unshift(0)  //此时的beam_divide为驱动立柱位置，加上梁起点
      beam_divide.push(beam_length)  //加上梁终点
      const maxLength = 12500    //考虑生产运输等因素的一个最大长度
      let midPoint = []  //中间要打段的点位置
      for (let i = 0; i < beam_divide.length - 1; i++) {
        let lenth = beam_divide[i + 1] - beam_divide[i]
        if (lenth > maxLength) {  //大于运输长度时，分段
          let pics = Math.floor(lenth / maxLength) + 1  //分成的段数
          for (let j = 1; j < pics; j++) {
            midPoint.push(beam_divide[i] + j * (lenth / pics).toFixed(0))
          }
        } else {
          //两个驱动立柱之间必须有一个断点
          if (i !== 0 && i !== beam_divide.length - 2) {
            midPoint.push(beam_divide[i] + (0.5 * lenth).toFixed(0))
          }
        }
      }

      //将端点、驱支立柱点和打断点放到一个数组并排序，就是所有的点了
      let arr = beam_divide.concat(midPoint)
        .sort(function(a, b) {
          return a - b
        })

      for (let i = 0; i < arr.length - 1; i++) {
        let start = arr[i]  //起点
        let end = arr[i + 1]  //终点
        let section = 'Octagon-' + b_diameter + 'x' + b_thickness[i]
        let len = arr[i + 1] - arr[i]  //350为插芯在后台再考虑，这里强调几何数据
        let cg = '中间主梁'
        if (i === 0 || i === arr.length - 2) {
          cg = '端部主梁'
        }
        if (drive_post.includes(arr[i] * 1) || drive_post.includes(arr[i + 1] * 1)) {
          cg = '驱动主梁'
        }

        let f = {
          start: start,
          end: end,
          section: section,
          origin_section: section,//原始截面
          material: b_material,
          length: len,  //350为插芯在后台再考虑，这里强调几何数据
          category: cg
        }
        beam_info_lst_2.push(f)
      }
      beam_info_lst = beam_info_lst_2
    }

    //post 对象内容 ：位置，截面，材质，高度，类别（非驱动/驱动）
    const post_info = strackerInfo.post_info_lst  //立柱
    for (let i = 0; i < post_info.length; i++) {
      let ar = post_info[i]
      post_position.push(ar[0])
      if (ar[1].startsWith('t')) {
        drive_post.push(ar[0] * 1)
      }  //保存到驱动立柱数组

      let f = {
        position: ar[0],
        category: ar[1].startsWith('t') ? '驱动' : '非驱动',
        material: ar[2],
        section: ar[3],
        origin_section: ar[3],//原始截面
        height: strackerInfo.h_post - this.postLengthReduce(ar[1].startsWith('t'), b_section_type, b_diameter, initInfo.slew_drive_inch),  //柱子高度
        pile_type: initInfo.pile_type,  //桩型  0-桩柱一体  1-地脚螺栓 2-PHC管桩 3-钢桩
        pile_obj: initInfo.pile_obj, //桩的对象（给后台进行Bom表生成）
        pile_desc: initInfo.pile_desc//桩的文字描述（给用户看的）
      }
      post_info_lst.push(f)
    }
    let pv_list = strackerInfo.solar_list//光伏板排布

    for (let i = 0; i < pv_list.length; i++) {
      if (typeof pv_list[i] === 'string' && pv_list[i].includes('=')) {
        pv_list[i] = +pv_list[i].split('=')[0]
      }
    }

    let purlinCount = 0
    if (b_section_type.includes('Octagon')) {  //multiple-Strider,多点，水平保护，主驱动有gap，从驱动无gap
      pv_list.forEach(element => {
        purlinCount += element * 1
      })
      purlinCount += 2
    } else {  //steady,1点或2点，大角度保护，主从驱动都有gap
      pv_list.forEach(element => {
        purlinCount += element * 1 + 1
      })
    }

    //显示行的颜色
    let rowColor = ''
    let purlinObj = []
    if (trackerPos == 'Exterior') {
      rowColor = '#FF3366'
      purlinObj = [{ id: 0, material: 'S420GD', section: '-1.5x30x30x60', length: 1450, amount: purlinCount,installPoints:'4*M6',blockNeed:false }]
    }
    if (trackerPos == 'Edge') {
      rowColor = '#FFFFCC'
      Math.floor(purlinCount * 0.3)
      purlinObj = [{
        id: 0,
        material: 'S420GD',
        section: '-1.5x30x30x60',
        length: 1450,
        amount: Math.floor(purlinCount * 0.3),
        installPoints:'4*M6',
        blockNeed:false
      },
        {
          id: 1,
          material: 'S420GD',
          section: '-1.5x30x30x60',
          length: 450,
          amount: purlinCount - Math.floor(purlinCount * 0.3),
          installPoints:'4*M6',
          blockNeed:false
        }]
    }
    if (trackerPos == 'Interior') {
      rowColor = '#33FF99'
      purlinObj = [{ id: 0, material: 'S420GD', section: '-1.5x30x30x60', length: 450, amount: purlinCount,installPoints:'4*M6',blockNeed:false }]
    }

    let strs = commonInfo.bb    //组件串数
    let h_min = commonInfo.h_min    //最小离地高度
    let pv_iftp = commonInfo.tp   //光伏板是否通铺

    //将以上数据封装成对象数组
    let r = new Tracker()
    r.id = fileName + '-' + trackerPos  //文件名称+‘-’+支架所在位置
    r.trackerNum = 1  //支架数量
    r.trackerRatio = 0 //支架占总支架数量比
    r.trackBrifeName = trackerPos + '-' + strs + 'strs'    //支架简称，位置+串数
    r.pvStringNum = strs//组件的串数
    r.trackerPos = trackerPos  //支架在外、边或内
    r.rowColor = rowColor//行的颜色，区分内外围用;外边内分别为红黄绿
    r.showPostBeamTable = false  //默认是否展开梁柱明细表
    r.ifCalculated = false  //是否已完成计算
    r.corrosion_proofing_grade = initInfo.corrosion_proofing_grade
    r.post_galvanizin_thickness = initInfo.post_galvanizin_thickness
    r.beam_galvanizin_thickness = initInfo.beam_galvanizin_thickness
    r.purlin_galvanizin_thickness = initInfo.purlin_galvanizin_thickness
    r.beam_brand = initInfo.beam_brand
    r.purlin_brand = initInfo.purlin_brand
    r.product_system = initInfo.product_system
    r.slew_drive_inch = initInfo.slew_drive_inch
    r.slew_cover_if_need = initInfo.slew_cover_if_need    //是否需要减速机罩
    r.dumper_num = initInfo.dumper_num
    r.dumper_type = initInfo.dumper_type
    r.power_supply = initInfo.power_supply
    r.pile_type = initInfo.pile_type  //桩大体上的类型  (在大面积输入时起作用)
    r.pile_obj = initInfo.pile_obj  //桩大体上对象 (在大面积输入时起作用)
    r.pile_desc = initInfo.pile_desc  //桩大体上描述 (在大面积输入时起作用)
    r.fweight_factor = initInfo.fweight_factor  //大体上带法兰立柱的法兰重量调整系数
    r.purlin_info_lst = purlinObj  //初始化一个檩条列表
    r.pv_length = commonInfo.length1  //光伏板长
    r.pv_width = commonInfo.width1  //光伏板宽
    r.pv_thickness = commonInfo.mkg //可能是板重量
    r.solar_list = pv_list  //光伏板排布
    r.solar_num = 0
    r.pv_capacity = initInfo.pv_capacity  //光伏板容量(W) 默认630
    r.tracker_capacity = 0  //单个支架的容量
    r.total_tracker_capacity = 0  //该种支架全部容量
    r.tracker_weight = 0  //单个支架重量
    r.total_tracker_weight = 0  //多个支架总重
    r.trackerPrice = 0  //单个支架的价格(不含备品备件)
    r.trackerTotalPrice = 0  //该种支架总的的价格(不含备品备件)
    r.pricePerWatt = 0  //瓦单价(不含备品备件)
    r.trackerPriceWithSpareParts = 0  //单个支架的价格(含备品备件)
    r.trackerTotalPriceWithSpareParts = 0  //该种支架总的的价格(含备品备件)
    r.pricePerWattWithSpareParts = 0  //瓦单价(含备品备件)
    r.slew_count = pv_list.length - 1  //减速机个数
    r.master_controlor = pv_list.length - 1  //主控制器个数
    r.server_controlor = pv_list.length - 2  //从控制器个数
    r.purlinCount = purlinCount
    r.dis = commonInfo.dis    //双联排时，用于计算连接杆的长度
    r.layout = commonInfo.pp    //1P或2P
    r.post_height = strackerInfo.h_post  //柱子高度
    r.h_min = h_min  //最小离地高度
    r.pv_iftp = pv_iftp  //光伏板是否通铺
    r.beam_length = beam_length  //主梁总长
    r.post_info_lst = post_info_lst  //立柱信息列表
    r.drive_post = drive_post  //驱动立柱信息
    r.beam_info_lst = beam_info_lst  //主梁信息列表
    r.beam_info_lst_1 = beam_info_lst_1  //主梁信息列表按立柱分段
    r.beam_info_lst_2 = beam_info_lst_2  //主梁信息列表按12.5米分段
    r.beam_section_dim = b_diameter  //主梁截面尺寸
    r.beam_section_type = b_section_type  //主梁类型
    r.resultList = []    //存放Bom表数据
    return r
  },

  //柱的上端点应该从梁中心点下移一段距离
  postLengthReduce(ifDravePost, b_section_type, b_diameter, slew_drive_inch) {
    let post_reduce = 0    //立柱从梁中线往回缩
    if (!ifDravePost) {  //非驱动
      if (b_section_type.includes('Diamond')) {
        post_reduce = 168
      }
      if (b_section_type.includes('Octagon')) {
        if (b_diameter === 165) {
          post_reduce = 153
        } else if (b_diameter === 141) {
          post_reduce = 157
        }
      }
    } else {
      let slew = slew_drive_inch
      if (b_section_type.includes('Diamond')) {
        if (slew.includes('7寸')) {
          post_reduce = 240
        }
        if (slew.includes('6寸')) {
          post_reduce = 230
        }
        if (slew.includes('5寸') && slew.includes('一级')) {
          post_reduce = 219
        }
        if (slew.includes('5寸') && slew.includes('二级')) {
          post_reduce = 231
        }
      }
      if (b_section_type.includes('Octagon')) {
        if (b_diameter === 165) {
          if (slew.includes('7寸')) {
            post_reduce = 240
          }
          if (slew.includes('6寸')) {
            post_reduce = 230
          }  //甲方未提供数据，暂定
          if (slew.includes('5寸') && slew.includes('一级')) {
            post_reduce = 219
          }  //甲方未提供数据，暂定
          if (slew.includes('5寸') && slew.includes('二级')) {
            post_reduce = 226
          }
        } else if (b_diameter === 141) {
          if (slew.includes('7寸')) {
            post_reduce = 240
          }
          if (slew.includes('6寸')) {
            post_reduce = 230
          }  //甲方未提供数据，暂定
          if (slew.includes('5寸') && slew.includes('一级')) {
            post_reduce = 214
          }
          if (slew.includes('5寸') && slew.includes('二级')) {
            post_reduce = 231
          }  //甲方未提供数据，暂定
        }
      }
    }
    return post_reduce
  },

  //根据位置确定柱子厚度
  getThickness(arrBeamDivide, arrThickness, startPoint, endPoint) {
    let thickness = arrThickness.slice(-1)  //默认值取最后一个
    for (let i = 0; i < arrBeamDivide.length; i++) {
      const element = arrBeamDivide[i] * 1
      //当点在梁上时，得到厚度
      if (element > startPoint && element <= endPoint) {
        thickness = arrThickness[i]
        break
      }
    }
    return thickness
  },

  //传入完整的plan对象,计算内部元素并刷新
  refreshModuleData(md) {
    let sparePartsList = md.spareParts
    let totalTrackerNum = 0 //全部支架总数
    for (let i = 0; i < md.trackersInfo.length; i++) {
      totalTrackerNum += md.trackersInfo[i].trackerNum * 1
    }
    md.weatherStationTotalPrice = md.weatherStationNum * md.weatherStationUnitPrice  //计算气象站总价
    totalTrackerNum = totalTrackerNum >= 1 ? totalTrackerNum : 1
    md.trackersInfo.forEach((t) => {
      let totalPVCapacity = t.pv_capacity * t.solar_num  //支架总容量
      totalPVCapacity = totalPVCapacity === 0 ? 1 : totalPVCapacity  //防止被0除
      t.trackerRatio = (100 * t.trackerNum / totalTrackerNum).toFixed(2)
      t.tracker_capacity = (totalPVCapacity / 1000).toFixed(3)  //单个支架的容量
      t.total_tracker_capacity = (t.trackerNum * totalPVCapacity / 1000).toFixed(2)  //该种支架全部容量

      t.tracker_weight = this.getTrackerWeight(t.resultList.bom1, t.resultList.bom2, t.resultList.bom3)  //单个支架重量
      t.total_tracker_weight = (t.tracker_weight * t.trackerNum).toFixed(3)  //单个支架重量
      //单个支架(不含备品备件)
      t.trackerPrice = this.getTrackerPrice(t.resultList.bom1, t.resultList.bom2, t.resultList.bom3)  //单个支架的价格(不含备品备件)
      t.trackerTotalPrice = (t.trackerPrice * t.trackerNum).toFixed(2)  //该种支架总的的价格(不含备品备件)
      t.pricePerWatt = (t.trackerPrice / totalPVCapacity).toFixed(3)  //瓦单价(不含备品备件)

      //单个支架(含备品备件)
      t.trackerPriceWithSpareParts =
        this.getTrackerPriceWithSpareParts(sparePartsList, t.resultList.bom1, t.resultList.bom2, t.resultList.bom3)  //单个支架的价格(含备品备件)
      t.trackerTotalPriceWithSpareParts = (t.trackerPriceWithSpareParts * t.trackerNum).toFixed(2)  //该种支架总的的价格(含备品备件)
      t.pricePerWattWithSpareParts = (t.trackerPriceWithSpareParts / totalPVCapacity).toFixed(3)  //瓦单价(含备品备件)
    })
    return md
  },
  //计算支架总重
  getTrackerWeight(bom1, bom2, bom3) {
    let bom = [...bom1, ...bom2, ...bom3]
    let weight = 0
    bom.forEach((t) => {
      weight += t.totalWeight * 1
    })
    return weight.toFixed(3)
  },

  //计算单套支架价格
  getTrackerPrice(bom1, bom2, bom3) {
    let bom = [...bom1, ...bom2, ...bom3]
    let price = 0
    bom.forEach((t) => {
      price += t.totalPrice * 1
    })
    return price.toFixed(4)
  },

  //价格分类列表1:按立柱，主梁，檩条，标准件，紧固件，电气&机械,其它等分类方式维度计算
  getPriceListCategory1(spareParts, bom1, bom2, bom3) {
    let bom = [...bom1, ...bom2, ...bom3]
    let price_post = 0
    let price_beam = 0
    let price_purlin = 0
    let price_standard = 0
    let price_fasten = 0
    let price_electricalMechanical = 0
    let price_other = 0

    for (let i = 0; i < bom.length; i++) {
      if (bom[i].productCategory === 'H型钢') {
        price_post = price_post + bom[i].totalPrice
      } else if (bom[i].productCategory === '主梁') {
        price_beam = price_beam + bom[i].totalPrice
      } else if (bom[i].productCategory === '檩条') {
        price_purlin = price_purlin + bom[i].totalPrice
      } else if (bom[i].productCategory === '标准件') {
        price_standard = price_standard + bom[i].totalPrice
      } else if (bom[i].productCategory === '紧固件') {
        price_fasten = price_fasten + bom[i].totalPrice
      } else if (bom[i].productCategory === '电气&机械') {
        price_electricalMechanical = price_electricalMechanical + bom[i].totalPrice
      } else {
        price_other = price_other + bom[i].totalPrice
      }
    }

    return {
      price_post: price_post * (1 + 0.01 * spareParts.post),
      price_beam: price_beam * (1 + 0.01 * spareParts.beam),
      price_purlin: price_purlin * (1 + 0.01 * spareParts.purlin),
      price_standard: price_standard * (1 + 0.01 * spareParts.standard),
      price_fasten: price_fasten * (1 + 0.01 * spareParts.fasten),
      price_electricalMechanical: price_electricalMechanical * (1 + 0.01 * spareParts.electricalMechanical),
      price_other: price_other * (1 + 0.01 * spareParts.other)
    }
  },

  //计算单套支架价格
  getTrackerPriceWithSpareParts(spareParts, bom1, bom2, bom3) {
    let r = this.getPriceListCategory1(spareParts, bom1, bom2, bom3)
    let price = 0
    price = r.price_post + r.price_beam + r.price_purlin + r.price_standard
      + r.price_fasten + r.price_electricalMechanical + r.price_other
    return price.toFixed(4)
  },

  //计算各参数
  //1-Cost Per Tracker(RMB)           2-Cost Per Watt(RMB)	       3-Cost Percentage
  //4-Weight total Tracker(Kg)	      5-Weight Per MW	             6-Weight Percentage
  getComponetParams(bom, trackerTotalPrice, trackerTotalWatt, trakcerWeight) {
    // console.log("=======",bom.length,trackerTotalPrice, trackerTotalWatt, trakcerWeight)
    trackerTotalPrice = trackerTotalPrice === 0 ? 1 : trackerTotalPrice  //总价格
    trackerTotalWatt = trackerTotalWatt === 0 ? 1 : trackerTotalWatt  //总瓦数
    trakcerWeight = trakcerWeight === 0 ? 1 : trakcerWeight  //总重量
    if (bom.length === 0) {
      return {
        costPerTracker: 0,
        costPerWatt: 0,
        costPercentage: 0,
        weightTotalTracker: 0,
        weightPerMw: 0,
        weightPercentage: 0
      }
    }
    let costPerTracker = 0
    for (let i = 0; i < bom.length; i++) {
      costPerTracker += bom[i].totalPrice
    }
    let weightTotalTracker = 0
    for (let i = 0; i < bom.length; i++) {
      weightTotalTracker += bom[i].totalWeight
    }
    let r = {
      costPerTracker: costPerTracker,
      costPerWatt: costPerTracker / trackerTotalWatt,
      costPercentage: 100 * costPerTracker / trackerTotalPrice,
      weightTotalTracker: weightTotalTracker,
      weightPerMw: weightTotalTracker / trackerTotalWatt / 1000,
      weightPercentage: 100 * weightTotalTracker / trakcerWeight
    }
    return r
  }

  // aaa(st, componetName, item) {
  //   let str = JSON.stringify(st) + ','
  //   let arr = str.split(componetName)
  //   let n = 0
  //   for (let i = 1; i < arr.length; i++) {
  //     let arr1 = arr[i].split(item)[1].split(',')[0]
  //     let r = arr1.replaceAll(':', '').replaceAll('{', '').replaceAll('{', '').replaceAll('"', '')
  //     n += r * 1
  //   }
  //   return !isNaN(n) ? n : 0
  // }
}



