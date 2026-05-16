<template>
  <div style="margin-left: 0px">
    <el-divider></el-divider>
    <h3 style="margin-left: 10px">调价表</h3>
    <table>
      <thead>
      <tr style="background-color:#f2af83;">
        <td style="width: 120px;">材料编号</td>
        <td style="width: 120px;">材料名称</td>
        <td style="width: 80px;">计价单位</td>
        <td style="width: 80px;">当前价格</td>
        <td style="width: 80px;">调后价格</td>
        <td style="width: 450px;">计价说明</td>
        <td style="width: 150px;">备注</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="t in adjustatbleList" :key="t.id">
        <td>{{ t.productCode }}</td>
        <td>{{ t.name|nameFilter }}</td>
        <td>{{ t.costPriceUnit }}</td>
        <td style="text-align: left;">{{ t.costPrice }}</td>
        <td>
          <input type="text" style="width:80px; margin-left: 2px;margin-right: 2px"
                 v-model="t.costAdjust"
          >
        </td>
        <td style="text-align: left">{{ t.costPriceMethod }}</td>
        <td>
          <input type="text" style="width:150px; margin-left: 2px;margin-right: 2px"
                 v-model="t.remark" placeholder="请输入"
          >
        </td>
      </tr>
      </tbody>
      <tfoot>
      <tr style="height: 60px">
        <td colspan="7" style="text-align: right">
          <el-button type="primary" @click="resetAdjustPrice">重置调整价格</el-button>
          <el-button type="primary" @click="afterAdjustPrice">调价后预览</el-button>
          <el-button type="success" @click="makeSureAdjustPrice" style="margin-right: 2px">确定调价</el-button>
        </td>

      </tr>
      </tfoot>
    </table>

    <el-divider></el-divider>
    <div v-if="afterAdjustPriceResultShow">
      <h3 style="margin-left: 10px">调价后新的价格信息表</h3>
<!--      <ResultSummary :md="afterAdjustPriceMdObj"></ResultSummary>-->
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import apiTracker from '@/views/pages/eset/trackers2/utils/apiTracker'

export default {
  name: 'AdjustPrice',
  components: {  },
  data() {
    return {
      adjustatbleList: [],
      mdObj: [],
      afterAdjustPriceMdObj: {},
      afterAdjustPriceResultShow: false,
      haveAdjustRecode: [],  //如果销售总监有价格调整，则在这里记录，确认后保存到数据库
    }
  },
  methods: {

    //重置调整价格(将调整价改为原价)
    resetAdjustPrice() {
      console.log("this.mdObj",this.mdObj)
      this.adjustatbleList.forEach(a => {
        a.costAdjust = a.costPrice
      })
      this.afterAdjustPrice()
    },

    //调价后，生成新的plan模型数据(只需要将bom表中要调价的总价列乘以调整系数，后面就能够按原来的组件进行性展示)
    afterAdjustPrice() {
      let haveAdjust = []  //找出已经调整的
      this.adjustatbleList.forEach(b => {
        let o = {
          id: b.id,
          componets: b.componets,
          productCode: b.productCode,
          name: b.name,
          costPriceMethod: b.costPriceMethod,
          costPriceUnit: b.costPriceUnit,
          costPrice: b.costPrice,
          costAdjust: b.costAdjust,  //调整后的价格，
          remark: b.remark
        }
        haveAdjust.push(o)  //得到所有记录
        //筛选出做过更改的记录，后面保存到数据库中
        this.haveAdjustRecode = []
        let tempRecode = []
        haveAdjust.forEach(b => {
          if (!Math.abs(b.costPrice - b.costAdjust) < 0.001) {
            tempRecode.push(b)
          }
        })
        this.haveAdjustRecode = {adjuster:this.name,item:tempRecode,time:Date.now()}

        haveAdjust.forEach(h => {
          // console.log(this.afterAdjustPriceMdObj.trackersInfo.length,"-----------------length-----------------------")
          for (let i = 0; i < this.afterAdjustPriceMdObj.trackersInfo.length; i++) {
            let t = this.afterAdjustPriceMdObj.trackersInfo[i]
            for (let j = 0; j < t.resultList.bom1.length; j++) {
              if (h.productCode == t.resultList.bom1[j].productCode) {
                // console.log(t.resultList.bom1[j].productCode, '原价为:' + t.resultList.bom1[j].totalPrice, '现改为:' + h.costAdjust)
                this.afterAdjustPriceMdObj.trackersInfo[i].resultList.bom1[j].totalPrice = h.costAdjust * 1
              }
            }
            for (let j = 0; j < t.resultList.bom2.length; j++) {
              if (h.productCode == t.resultList.bom2[j].productCode) {
                this.afterAdjustPriceMdObj.trackersInfo[i].resultList.bom2[j].totalPrice = h.costAdjust * 1
              }
            }
            for (let j = 0; j < t.resultList.bom3.length; j++) {
              if (h.productCode == t.resultList.bom3[j].productCode) {
                this.afterAdjustPriceMdObj.trackersInfo[i].resultList.bom3[j].totalPrice = h.costAdjust * 1
              }
            }
          }
        })
      })
      this.afterAdjustPriceResultShow = true
      this.afterAdjustPriceMdObj = apiTracker.refreshModuleData(this.afterAdjustPriceMdObj)  //重新计算结果
      console.log('afterAdjustPriceMdObj', this.afterAdjustPriceMdObj)
    },
    getAdjustatblePriceList(plan) {
      if (plan === null) {
        return []
      }
      let planObj = {}
      if (typeof plan === 'string') {
        planObj = JSON.parse(plan)
      } else {
        planObj = plan
      }
      let adjustatblePriceBomList = []
      //筛选出可调价的清单
      planObj.trackersInfo.forEach(t => {
        let bom = [...t.resultList.bom1, ...t.resultList.bom2, ...t.resultList.bom3]
        bom.forEach(b => {
          if (b.componets.toLowerCase() === 'drives system') {
            adjustatblePriceBomList.push(b)
          } else if (b.componets.toLowerCase() === 'control system') {
            adjustatblePriceBomList.push(b)
          } else if (b.componets.toLowerCase() === 'damper') {
            adjustatblePriceBomList.push(b)
          } else if (b.componets.toLowerCase() === 'post') {
            adjustatblePriceBomList.push(b)
          } else if (b.componets.toLowerCase() === 'torque tube') {
            adjustatblePriceBomList.push(b)
          } else if (b.componets.toLowerCase() === 'purlin') {
            adjustatblePriceBomList.push(b)
          }
        })
      })
      let adjustatbleList = []  //将计价方式保存在列表中，并保证唯一
      adjustatblePriceBomList.forEach(b => {
        // temp 的顺序不能变，否则转对象时将会受影响
        let temp = [b.componets, b.productCode, b.name, b.costPriceMethod, b.costPriceUnit, b.costPriceLocal, b.costPriceLocal, '']
        if (!adjustatbleList.includes(temp)) {
          adjustatbleList.push(temp)
        }
      })
      //去重
      let uniqueList = []
      for (let i = 0; i < adjustatbleList.length; i++) {
        // 将子数组转换为字符串
        let listItemString = JSON.stringify(adjustatbleList[i])
        // 检查转换后的字符串是否已存在于 uniqueList 中
        if (uniqueList.map(JSON.stringify).indexOf(listItemString) === -1) {
          uniqueList.push(adjustatbleList[i])
        }
      }
      let uniqueObjList = []
      //组装成对象list
      uniqueList.forEach((b => {
        let o = {
          id: 100,
          sortId: this.getSortId(b[0]),
          componets: b[0],
          productCode: b[1],
          name: b[2],
          costPriceMethod: b[3],
          costPriceUnit: b[4],
          costPrice: b[5],
          costAdjust: b[6],  //调整后的价格，
          remark: b[7]
        }
        uniqueObjList.push(o)
      }))
      //按sortId进行排序，如果sortId相等，则按计价方法进行排序
      uniqueObjList.sort((item1, item2) => {
        // 首先比较 sortId
        if (item1.sortId !== item2.sortId) {
          return item1.sortId - item2.sortId
        }
        // 如果 sortId 相等，则比较 remark
        // 确保 costPriceMethod 不是 undefined
        if (item1.costPriceMethod === undefined) return 1
        if (item2.costPriceMethod === undefined) return -1
        return item1.costPriceMethod.localeCompare(item2.recostPriceMethodmark)
      })

      //统一id
      let n = 0
      uniqueObjList.forEach(t => {
        t.id = n++
      })

      return uniqueObjList
    },
    getSortId(typeName) {
      // const sortRule = ['Drives System', 'Control system', 'Damper','Post', 'Torque Tube','Prulin']
      if (typeName.toLowerCase() === 'drives system') {
        return 1
      } else if (typeName.toLowerCase() === 'control system') {
        return 2
      } else if (typeName.toLowerCase() === 'damper') {
        return 3
      } else if (typeName.toLowerCase() === 'post') {
        return 4
      } else if (typeName.toLowerCase() === 'torque tube') {
        return 5
      } else if (typeName.toLowerCase() === 'purlin') {
        return 6
      } else {
        return 9
      }
    },

    //确定调价
    makeSureAdjustPrice(){
      this.afterAdjustPrice()
      console.log("makeSureAdjustPrice",this.haveAdjustRecode)

      if(this.haveAdjustRecode.item.length>0){
        fetch(process.env.VUE_APP_BASE_API + '/api/salesDirectorAdjustPrice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': getToken()// 添加Authorization字段，使用Bearer认证方式
          },
          body: JSON.stringify(
            this.mdObj.plan_code
            + 'XxXxX' + JSON.stringify(this.haveAdjustRecode)
            + 'XxXxX' + JSON.stringify({remark:'暂无'})
          )
        })
          .then(response => {
            // 确保服务器响应为成功状态码
            if (response.ok) {
              // 获取响应体中的JSON数据
              return response.json()
            } else {
              // 如果响应状态码不是2xx，抛出错误
              throw new Error('Something went wrong on server side.')
            }
          })
          .then(r => {

          })
          .catch(error => {
            // 捕捉fetch过程中或处理响应时的错误
            console.error('Error:', error)
          })


      }
      alert("价格调整完成，后续请点击'通过'按钮，以传给销售经理")
    }

  },

  computed: {
    ...mapGetters([
      'name'
    ]),
  },
  props: {
    md: {}
  },
  mounted() {
    if (typeof this.md === 'string') {
      this.mdObj = JSON.parse(this.md)
    } else {
      this.mdObj = this.md
    }
    this.adjustatbleList = this.getAdjustatblePriceList(this.mdObj)
    this.afterAdjustPriceMdObj = JSON.parse(JSON.stringify(this.mdObj))    //深拷贝整个plan对象
    this.haveAdjustRecode = []  //要保存到数据库的调价信息，这里先清空一下
  },

  filters: {
    // 材料名称过滤器
    nameFilter(value) {
      return value.replace('非驱动立柱 Non Drive Post', '非驱动立柱')
        .replace('驱动立柱 Drive Post', '驱动立柱')
    }
  }

}

</script>

<style scoped>
/* CSS样式 */
table {
  margin-left: 10px;
  border-collapse: collapse; /* 确保边框不会重叠 */
  border: 1px solid #000000; /* 设置表格边框颜色和宽度 */
}

th, td {
  text-align: center;
  border: 1px solid black; /* 设置表格内部单元格边框颜色和宽度 */
}

</style>
