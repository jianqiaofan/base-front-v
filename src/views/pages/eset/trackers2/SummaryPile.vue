<template>
  <div>
    <table>
      <caption>
        桩信息表
      </caption>
      <thead>
      <tr style="background-color:#f2af83;">
        <td style="width: 60px">序号</td>
        <td style="width: 160px">型号</td>
        <td style="width: 100px">Tracker数量</td>
        <td style="width: 100px">桩数量</td>
        <td style="width: 100px">总桩数</td>
        <td style="width: 100px">桩类型</td>
        <td style="width: 100px">最大桩长</td>
        <td style="width: 100px">最小桩长</td>
        <td style="width: 100px">平均桩长</td>
        <td style="width: 120px">10cm桩价格</td>
<!--        <td style="width: 120px">10cm桩瓦单价</td>-->
<!--        <td style="width: 120px">10cm桩百分比</td>-->
      </tr>
      </thead>
      <tbody>
      <tr v-for="r in showResultList.tracker" :key="r.trackBrifeName">
        <td>{{ r.num }}</td>
        <td>{{ r.trackBrifeName }}</td>
        <td>{{ r.trackerNum }}</td>
        <td>{{ r.tracker_pile_num|filterFix(0) }}</td>
        <td>{{ r.trackers_pile_num|filterFix(0) }}</td>
        <td>{{ r.pileType }}</td>
        <td>{{ r.pileMaxLength }}</td>
        <td>{{ r.pileMinLength }}</td>
        <td>{{ r.pileAverageLength }}</td>
        <td>{{ r.price_10cm }}元</td>
<!--        <td>{{ r.weight_composition.damper|filterFix(3) }}</td>-->
<!--        <td>{{ r.weight_composition.post|filterFix(3) }}</td>-->
<!--        <td>{{ r.weight_composition.torqueTube|filterFix(3) }}</td>-->
<!--        <td>{{ r.weight_composition.torqueTube|filterFix(3) }}</td>-->
<!--        <td>{{ r.weight_composition.torqueTube|filterFix(3) }}</td>-->
<!--        <td>{{ r.weight_composition.torqueTube|filterFix(3) }}</td>-->
      </tr>
      </tbody>
    </table>

  </div>
</template>
<script>
import {getPileDetails} from '@/views/pages/eset/trackers2/utils/classPlan.js'
export default {
  name: 'SummaryWeight',
  data() {
    return {

    }
  },
  computed: {
    showResultList() {
      const a = getPileDetails(this.mdObj)
      console.log("aaaa",a)
      return a
    },
  },

  filters:{
    filterFix(value,n){
      if (value != null && value>0){
        return value.toFixed(n)
      }
      else{
        return 0
      }
    },


  },
  props: {
    mdObj: {},
    trackerCategory:0
  },
  mounted(){
    console.log("####",this.mdObj)
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
