<template>
  <div>
    <el-divider></el-divider>
    <h2>Summary Result111</h2>
    <el-table
      :data="summaryData"
      border
      style="width: 1800px">
      <el-table-column type="index" label="序号" width="50" :index="indexMethod"></el-table-column>
      <el-table-column prop="trackBrifeName" label="型号"></el-table-column>
      <el-table-column prop="trackerNum" label="数量(套)" width="100"></el-table-column>
      <el-table-column prop="trackerNumRatio" label="占比%" width="100" :formatter="formatNumber3"></el-table-column>
      <el-table-column prop="trackerWeight" label="单套重量(kg)" width="120" :formatter="formatNumber3"></el-table-column>
      <el-table-column prop="trackerCapacity" label="容量(kW)" width="130" :formatter="formatNumber3"></el-table-column>
      <el-table-column prop="trackerTotalWeight" label="总重量(kg)" width="160" :formatter="formatNumber3"></el-table-column>
      <el-table-column prop="trackerTotalCapacity" label="总容量(kW)" width="150" :formatter="formatNumber3"></el-table-column>
      <el-table-column prop="trackerPrice" label="单套价格" width="100" :formatter="formatNumber2"></el-table-column>
      <el-table-column prop="trackerTotalPrice" label="总价格" width="160" :formatter="formatNumber2"></el-table-column>
      <el-table-column prop="pricePerWatt" label="瓦单价" width="100" :formatter="formatNumber6"></el-table-column>
      <el-table-column prop="trackerPriceSpare" label="单套价格(含)" width="120" :formatter="formatNumber2"></el-table-column>
      <el-table-column prop="trackerTotalPriceSpare" label="总价格(含)" width="160" :formatter="formatNumber2"></el-table-column>
      <el-table-column prop="pricePerWattSpare" label="瓦单价(含)" width="100" :formatter="formatNumber6"></el-table-column>
    </el-table>
    <p style="color: red">* (含) 表示此数据是含有备品备件的数据</p>

  </div>
</template>
<script>

export default {
  name: 'SummaryPlan',
  data() {
  },

  methods:{
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
    },
    formatNumber6(row, column, cellValue) {
      if (typeof (cellValue) === 'number') {
        if (cellValue === 0) {
          return ''
        }
        if (Number.isInteger(cellValue)) {
          return cellValue // 如果是整数，直接返回该数字
        } else {
          return cellValue.toFixed(6)
        }
      } else {
        return cellValue
      }
    }

  },
  created(){
    console.log(this.summaryData)
  },
  props:{
    summaryData:{}
  }



}

</script>

<style scoped>



</style>
