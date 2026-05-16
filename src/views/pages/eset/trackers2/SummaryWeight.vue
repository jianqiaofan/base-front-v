<template>
  <div>
    <table>
      <caption>
        重量明细表
      </caption>
      <thead>
      <tr>
        <td rowspan="2" style="width: 40px">序号</td>
        <td rowspan="2" style="width: 150px">型号</td>
        <td colspan="10">单套支架重量组成(kg)</td>
        <td colspan="4">重量分类汇总(kg)</td>
        <td colspan="2">总重(Ton)</td>
        <td rowspan="2" style="width: 100px">Ton/MW</td>
      </tr>
      <tr style="background-color:#f2af83;">
        <td style="width: 60px">减速机</td>
        <td style="width: 60px">控制器</td>
        <td style="width: 60px">阻尼</td>
        <td style="width: 60px">立柱</td>
        <td style="width: 60px">主梁</td>
        <td style="width: 60px">檩条</td>
        <td style="width: 60px">冲压件</td>
        <td style="width: 60px">铸造件</td>
        <td style="width: 60px">紧固件</td>
        <td style="width: 60px">其它</td>

        <td style="width: 80px">单套重</td>
        <td style="width: 80px">结构主件</td>
        <td style="width: 80px">结构其它</td>
        <td style="width: 80px">电气机械</td>
        <td style="width: 80px">套数(个)</td>
        <td style="width: 80px">总重</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="r in showResultList.tracker" :key="r.trackBrifeName">
        <td>{{ r.num }}</td>
        <td>{{ r.trackBrifeName }}</td>
        <td>{{ r.weight_composition.drivesSystem }}</td>
        <td>{{ r.weight_composition.controlSystem|filterFix(3) }}</td>
        <td>{{ r.weight_composition.damper|filterFix(3) }}</td>
        <td>{{ r.weight_composition.post|filterFix(3) }}</td>
        <td>{{ r.weight_composition.torqueTube|filterFix(3) }}</td>
        <td>{{ r.weight_composition.purlin|filterFix(3) }}</td>
        <td>{{ r.weight_composition.stampingParts|filterFix(3) }}</td>
        <td>{{ r.weight_composition.castingPart|filterFix(3) }}</td>
        <td>{{ r.weight_composition.fastners|filterFix(3) }}</td>
        <td>{{ r.weight_composition.others|filterFix(3) }}</td>
        <td style="background-color: #61c091">{{ r.trackerWeight|filterFix(3) }}</td>
        <td>{{ r.weightStructureMain|filterFix(3)}}</td>
        <td>{{ r.weightStructureOther|filterFix(3)}}</td>
        <td>{{ r.weightElectricalMechanical|filterFix(3)}}</td>
        <td>{{ r.trackerNum}}</td>
        <td  style="background-color: #61c091">{{ r.trackerTotalWeight/1000|filterFix(3)}}</td>
        <td >{{ r.weightPerMw|filterFix(3)}}</td>
      </tr>
      <tr style="height: 30px">
        <td colspan="2">合计</td>
        <td>{{showResultList.total.drivesSystem/1000|filterFix(3)}}</td>
        <td>{{showResultList.total.controlSystem/1000|filterFix(3)}}</td>
        <td>{{showResultList.total.damper/1000|filterFix(3)}}</td>
        <td>{{showResultList.total.post/1000|filterFix(3)}}</td>
        <td>{{showResultList.total.torqueTube/1000|filterFix(3)}}</td>
        <td>{{showResultList.total.purlin/1000|filterFix(3)}}</td>
        <td>{{showResultList.total.stampingParts/1000|filterFix(3)}}</td>
        <td>{{showResultList.total.castingPart/1000|filterFix(3)}}</td>
        <td>{{showResultList.total.fastners/1000|filterFix(3)}}</td>
        <td>{{showResultList.total.others/1000|filterFix(3)}}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>{{showResultList.total.totalTrackerNum}}</td>
        <td><span style="color: red;font-weight: bold">{{showResultList.total.totalWeight|filterFix(3)}}</span></td>
        <td><span style="font-weight: bold">{{showResultList.total.totalMainWeightPerMw|filterFix(3)}}</span></td>
      </tr>
      </tbody>
    </table>

  </div>
</template>
<script>
import {getWeightDetails} from '@/views/pages/eset/trackers2/utils/classPlan.js'
export default {
  name: 'SummaryWeight',
  data() {
    return {

    }
  },
  computed: {
    showResultList() {
      return getWeightDetails(this.mdObj)
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
