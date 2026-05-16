<template>
  <div>
    <el-divider></el-divider>
    <table>
      <caption>
        Summary Price By {{priceMsg.whoAdjust}}
      </caption>
      <thead>
      <tr style="background-color:#f2af83;">
        <td style="width: 80px">序号</td>
        <td style="width: 160px">型号</td>
        <td style="width: 80px">数量</td>
        <td style="width: 80px">单套容量(kW)</td>
        <td style="width: 80px">总容量</td>
        <td style="width: 80px">瓦单价</td>
        <td style="width: 80px">单套价</td>
        <td style="width: 80px">减速机</td>
        <td style="width: 80px">控制器</td>
        <td style="width: 80px">阻尼</td>
        <td style="width: 80px">立柱</td>
        <td style="width: 80px">主梁</td>
        <td style="width: 80px">檩条</td>
        <td style="width: 80px">冲压件</td>
        <td style="width: 80px">铸造件</td>
        <td style="width: 80px">紧固件</td>
        <td style="width: 80px">其它</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="r in priceMsg.tracker" :key="r.trackBrifeName">
        <td>{{ r.num }}</td>
        <td>{{ r.trackerBrifeName }}</td>
        <td>{{ r.trackerNum }}</td>
        <td>{{ r.trackerCapacity|filterFix(3) }}</td>
        <td>{{ r.trackerTotalCapacity|filterFix(3) }}</td>
        <td>{{ r.pricePerWatt|filterFix(3) }}</td>
        <td>{{ r.totalPrice|filterFix(2) }}</td>
        <td>{{ r.price_composition.drivesSystem }}</td>
        <td>{{ r.price_composition.controlSystem|filterFix(2) }}</td>
        <td>{{ r.price_composition.damper|filterFix(2) }}</td>
        <td>{{ r.price_composition.post|filterFix(2) }}</td>
        <td>{{ r.price_composition.torqueTube|filterFix(2) }}</td>
        <td>{{ r.price_composition.purlin|filterFix(2) }}</td>
        <td>{{ r.price_composition.stampingParts|filterFix(2) }}</td>
        <td>{{ r.price_composition.castingPart|filterFix(2) }}</td>
        <td>{{ r.price_composition.fastners|filterFix(2) }}</td>
        <td>{{ r.price_composition.others|filterFix(2) }}</td>
      </tr>
      <tr style="height: 36px;">
        <td colspan="3" style="text-align: left">项目总价:<span style="color: red;margin: 2px 10px">{{priceMsg.planTotalPrice|filterFix(2)}}</span>(RMB)</td>
        <td>{{priceMsg.planTrackerNum}}</td>
        <td>{{priceMsg.planTotalCapacity|filterFix(3)}}</td>
        <td style="color: red">{{priceMsg.planPricePerWatt|filterFix(4)}}</td>
        <td colspan="11">立柱、主梁和檩条已考虑容量调价系数：{{capacityAdjustRatio}}</td>
      </tr>
      </tbody>
    </table>


  </div>
</template>
<script>
import {getCapacityAdjustRatio} from '@/views/pages/eset/trackers2/utils/classPlan.js'
export default {
  name: 'ResultSummary',
  data() {
    return {

    }
  },
  computed: {
    capacityAdjustRatio(){
      return getCapacityAdjustRatio(1000 * this.priceMsg.planTotalCapacity)
    }
  },

  methods: {


  },

  filters:{
    filterFix(value,n){
      if (value != null && value>0){
        return value.toFixed(n)
      }
      else{
        return ""
      }
    },


  },
  props: {
    priceMsg: {},
  },

  mounted(){
    console.log('SummaryPrice  mounted,,,',this.mdObj)
    console.log("priceMsg",this.priceMsg)
  },


}

</script>

<style scoped>
/* CSS样式 */
table {
  margin-left: 10px;
  border-collapse: collapse; /* 确保边框不会重叠 */
  border: 1px solid black; /* 设置表格边框颜色和宽度 */

}

caption{
  font-size: 24px;
  padding-bottom: 10px;
}

th, td {
  text-align: center;
  border: 1px solid black; /* 设置表格内部单元格边框颜色和宽度 */
}

</style>
