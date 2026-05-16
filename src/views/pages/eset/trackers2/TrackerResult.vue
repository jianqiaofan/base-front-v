<template>
  <div class="scrollable-div" style="text-align: center;height: 1600px;">
    <div v-if="tableDataErr.length>0" class="table-caption">
      <span style="font-size: 30px;color: red">{{ trackerObj.trackBrifeName }}-计算异常表/some thing wrong</span>
      <el-table
        :data="tableDataErr"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="num" label="序号" width="60"></el-table-column>
        <el-table-column prop="name" label="处理建议" width="200"></el-table-column>
        <el-table-column prop="specification" label="错误定位" width="300"></el-table-column>
        <el-table-column prop="remark" label="问题描述"></el-table-column>
      </el-table>
      <div style="height: 40px;line-height: 40px; background-color: wheat">The End</div>
      <el-divider></el-divider>
    </div>

    <div class="summary">
<!--      <span style="font-size: 30px;color: #337c99">{{ trackerObj.trackBrifeName }} single tracker summary</span>-->
      <table>
        <tr>
          <td colspan="10"><h2>{{ trackerObj.trackBrifeName }} single tracker summary</h2></td>
        </tr>
        <tr>
          <td>型号</td>
          <td>数量</td>
          <td>占比</td>
          <td>单套重量(kg)</td>
          <td>单套重量(含)</td>
          <td>容量(kW)</td>
          <td>单套价格</td>
          <td>单套价格(含)</td>
          <td>瓦单价</td>
          <td>瓦单价(含)</td>
        </tr>
        <tr>
          <td>{{trackerObj.trackBrifeName}}</td>
          <td>{{trackerObj.trackerNum}}</td>
          <td>{{trackerObj.trackerNumRatio.toFixed(3)}}%</td>
          <td>{{trackerObj.trackerWeight.toFixed(3)}}</td>
          <td>{{trackerObj.trackerWeightSpare.toFixed(3)}}</td>
          <td>{{trackerObj.trackerCapacity/1000}}</td>
          <td>{{trackerObj.trackerPrice.toFixed(2)}}</td>
          <td>{{trackerObj.trackerPriceSpare.toFixed(2)}}</td>
          <td>{{trackerObj.pricePerWatt.toFixed(5)}}</td>
          <td>{{trackerObj.pricePerWattSpare.toFixed(5)}}</td>
        </tr>
        <tr>
          <td colspan="10" style="color: red;text-align: left">* (含) 表示此数据是含有备品备件的数据</td>
        </tr>

      </table>
    </div>

    <div class="bom-table" v-for="t in tableDatas">
      <span style="font-size: 30px;color: #337c99">{{ trackerObj.trackBrifeName }}-{{ t.tableName }}</span>
      <el-table
        :data="t.body"
        border
        :summary-method="getSummaries"
        show-summary
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <!--        <el-table-column sortable prop="priceId" label="材料id"  width="180"></el-table-column>-->
        <el-table-column type="index" label="序号" width="50" :index="indexMethod"></el-table-column>
        <el-table-column sortable prop="name" label="名称" width="180"></el-table-column>
        <el-table-column prop="partNo" label="件号" width="80"></el-table-column>
        <el-table-column prop="specification" label="规格" width="200"></el-table-column>
        <el-table-column prop="material" label="材质" width="120"></el-table-column>
        <el-table-column prop="length" label="长度" width="80" :formatter=formatNumber2></el-table-column>
        <el-table-column prop="weightPerMater" label="米重" width="80" :formatter="formatNumber3"></el-table-column>
        <el-table-column prop="amount" label="数量" width="80"></el-table-column>
        <el-table-column prop="unitWeight" label="单件重" width="80" :formatter="formatNumber3"></el-table-column>
        <el-table-column prop="totalWeight" label="总重" width="80" :formatter="formatNumber3"></el-table-column>
        <el-table-column prop="priceMethod" label="计价方式" width="80"></el-table-column>
        <el-table-column prop="costPrice" label="成本价" width="80" :formatter="formatNumber2"></el-table-column>
        <el-table-column prop="unitPrice" label="单价" width="80" :formatter="formatNumber2"></el-table-column>
        <el-table-column prop="totalPrice" label="总价" width="80" :formatter="formatNumber2"></el-table-column>
        <el-table-column prop="sparePartRatio" label="备件率" width="80"></el-table-column>
        <el-table-column prop="totalPriceSpare" label="含备件总价" width="100" :formatter="formatNumber2"
        ></el-table-column>
        <el-table-column prop="surfaceTreatment" label="防腐要求" width="180"></el-table-column>
        <el-table-column prop="processSite" label="生产地" width="100"></el-table-column>
        <el-table-column prop="remark" label="备注" width="180"></el-table-column>
      </el-table>
      <div style="height: 40px;line-height:40px;background-color: wheat">The End</div>
      <el-divider></el-divider>
    </div>


  </div>


</template>

<script>
import echarts from 'echarts/lib/echarts'
import { getToken } from '@/utils/auth'

export default {
  name: 'TrackerResult',
  data() {
    return {}
  },
  computed: {
    tableDatas() {
      return [
        { tableName: '主材表', body: this.tableData1 },
        { tableName: '紧固件', body: this.tableData2 },
        { tableName: '机械与电器', body: this.tableData3 }

      ]
    },
    //分表:主材表
    tableData1() {
      const items = ['04', '05', '06', '07', '08']
      return this.trackerObj.resultList.bom1.filter(b => items.includes(b.priceId.substring(0, 2)))
    },
    //分表:紧固件表
    tableData2() {
      const items = ['09']
      return this.trackerObj.resultList.bom1.filter(b => items.includes(b.priceId.substring(0, 2)))
    },
    //分表:机械电气
    tableData3() {
      const items = ['01', '02', '03', '20']
      return this.trackerObj.resultList.bom1.filter(b => items.includes(b.priceId.substring(0, 2)))
    },
    //分表:异常表
    tableDataErr() {
      return this.trackerObj.resultList.bomErr
    }

  },

  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        if (['totalWeight', 'totalPrice', 'totalPriceSpare'].includes(column.property)) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            if (column.property.includes('Weight')) {
              sums[index] = sums[index].toFixed(3)
            } else {
              sums[index] = sums[index].toFixed(2)
            }
          }
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    indexMethod(index) {
      return index + 1
    },
    formatNumber2(row, column, cellValue) {
      if (typeof (cellValue) === 'number') {
        if (cellValue === 0) {
          return ''
        }
        if (Number.isInteger(cellValue)) {
          return cellValue // 如果是整数，直接返回该数字
        } else {
          return cellValue.toFixed(2)
        }
      } else {
        return cellValue
      }
    },
    formatNumber3(row, column, cellValue) {
      if (typeof (cellValue) === 'number') {
        if (cellValue === 0) {
          return ''
        }
        if (Number.isInteger(cellValue)) {
          return cellValue // 如果是整数，直接返回该数字
        } else {
          return cellValue.toFixed(3)
        }
      } else {
        return cellValue
      }
    }
  },

  props: {
    trackerObj: {}  //传入一个支架信息
  },
  mounted() {
    // console.log("TrackerResult")
    // console.log(this.trackerObj)

    // console.log(this.trackerObj)
    // console.log(this.planPriceAdjust)
    // this.showEChartClass1()
    // this.showEChartClass2()
    // this.showEChartClass3()

  }

}


</script>

<style lang="scss" scoped>

.scrollable-div {
  height: 200px;
  overflow-y: scroll;
}

.summary table {
  margin-left: 10px;
  border-collapse: collapse; /* 确保边框不会重叠 */
  border: 1px solid black; /* 设置表格边框颜色和宽度 */
}

.summary table caption {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 10px;
  /* 根据需要添加更多样式 */
}

.bom-table {
  margin-bottom: 100px
}

.summary table tr {
  height: 50px;
}
.summary table th, td {
  width: 100px;
  border: 1px solid black; /* 设置表格内部单元格边框颜色和宽度 */
  text-align: center;
}


a {
  color: #0e5ada;
  text-decoration: underline;
}


.partImg {
  z-index: 11;
  position: absolute;
  top: 50%;
  left: 10%;
  width: 400px;
  background-color: #cc1818;
  transform: translate(-50%, -50%); /* 使用transform进行居中 */
}

.dwgImg {
  z-index: 12;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1200px;
  background-color: #cc1818;
  transform: translate(-50%, -50%); /* 使用transform进行居中 */
}

</style>



