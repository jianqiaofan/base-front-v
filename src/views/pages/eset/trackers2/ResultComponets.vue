<template>
  <div>
    <div v-for="t in cp">
      <table>
        <caption>
          <label>{{ t.tracker_name }}</label>
        </caption>
        <thead>
        <tr style="background-color: #7a7a7a;color: white">
          <td style="width:120px">Componets</td>
          <td style="width:120px">Cost Per Tracker(RMB)</td>
          <td style="width:120px">Cost Per Watt(RMB)</td>
          <td style="width:120px">Cost Percentage</td>
          <td style="width:120px">Weight total Tracker(Kg)</td>
          <td style="width:120px">Weight Per MW</td>
          <td style="width:120px">Weight Percentage</td>
        </tr>

        </thead>
        <tbody>
        <tr><td>Drives System</td>
          <td>{{ t.drives_system.costPerTracker|f1(2) }}</td>
          <td>{{ t.drives_system.costPerWatt|f1(4) }}</td>
          <td>{{ t.drives_system.costPercentage|f1(1) }}%</td>
          <td>{{ t.drives_system.weightTotalTracker|f1(3) }}</td>
          <td>{{ t.drives_system.weightPerMw|f1(4) }}</td>
          <td>{{ t.drives_system.weightPercentage|f1(1) }}%</td>
        </tr>
        <tr><td>Control system</td>
          <td>{{ t.control_system.costPerTracker|f1(2) }}</td>
          <td>{{ t.control_system.costPerWatt|f1(4) }}</td>
          <td>{{ t.control_system.costPercentage|f1(1) }}%</td>
          <td>{{ t.control_system.weightTotalTracker|f1(3) }}</td>
          <td>{{ t.control_system.weightPerMw|f1(4) }}</td>
          <td>{{ t.control_system.weightPercentage|f1(1) }}%</td>
        </tr>
        <tr><td>Damper</td>
          <td>{{ t.damper.costPerTracker|f1(2) }}</td>
          <td>{{ t.damper.costPerWatt|f1(4) }}</td>
          <td>{{ t.damper.costPercentage|f1(1) }}%</td>
          <td>{{ t.damper.weightTotalTracker|f1(3) }}</td>
          <td>{{ t.damper.weightPerMw|f1(4) }}</td>
          <td>{{ t.damper.weightPercentage|f1(1) }}%</td>
        </tr>
        <tr><td>Post</td>
          <td>{{ t.post.costPerTracker|f1(2) }}</td>
          <td>{{ t.post.costPerWatt|f1(4) }}</td>
          <td>{{ t.post.costPercentage|f1(1) }}%</td>
          <td>{{ t.post.weightTotalTracker|f1(3) }}</td>
          <td>{{ t.post.weightPerMw|f1(4) }}</td>
          <td>{{ t.post.weightPercentage|f1(1) }}%</td>
        </tr>
        <tr><td>Torque Tube</td>
          <td>{{ t.torque_tube.costPerTracker|f1(2) }}</td>
          <td>{{ t.torque_tube.costPerWatt|f1(4) }}</td>
          <td>{{ t.torque_tube.costPercentage|f1(1) }}%</td>
          <td>{{ t.torque_tube.weightTotalTracker|f1(3) }}</td>
          <td>{{ t.torque_tube.weightPerMw|f1(4) }}</td>
          <td>{{ t.torque_tube.weightPercentage|f1(1) }}%</td>
        </tr>
        <tr><td>Purlin</td>
          <td>{{ t.purlin.costPerTracker|f1(2) }}</td>
          <td>{{ t.purlin.costPerWatt|f1(4) }}</td>
          <td>{{ t.purlin.costPercentage|f1(1) }}%</td>
          <td>{{ t.purlin.weightTotalTracker|f1(3) }}</td>
          <td>{{ t.purlin.weightPerMw|f1(4) }}</td>
          <td>{{ t.purlin.weightPercentage|f1(1) }}%</td>
        </tr>
        <tr><td>Stamping Part</td>
          <td>{{ t.stamping_parts.costPerTracker|f1(2) }}</td>
          <td>{{ t.stamping_parts.costPerWatt|f1(4) }}</td>
          <td>{{ t.stamping_parts.costPercentage|f1(1) }}%</td>
          <td>{{ t.stamping_parts.weightTotalTracker|f1(3) }}</td>
          <td>{{ t.stamping_parts.weightPerMw|f1(4) }}</td>
          <td>{{ t.stamping_parts.weightPercentage|f1(1) }}%</td>
        </tr>
        <tr><td>Casting Part</td>
          <td>{{ t.casting_part.costPerTracker|f1(2) }}</td>
          <td>{{ t.casting_part.costPerWatt|f1(4) }}</td>
          <td>{{ t.casting_part.costPercentage|f1(1) }}%</td>
          <td>{{ t.casting_part.weightTotalTracker|f1(3) }}</td>
          <td>{{ t.casting_part.weightPerMw|f1(4) }}</td>
          <td>{{ t.casting_part.weightPercentage|f1(1) }}%</td>
        </tr>
        <tr><td>Fastners</td>
          <td>{{ t.fastners.costPerTracker|f1(2) }}</td>
          <td>{{ t.fastners.costPerWatt|f1(4) }}</td>
          <td>{{ t.fastners.costPercentage|f1(1) }}%</td>
          <td>{{ t.fastners.weightTotalTracker|f1(3) }}</td>
          <td>{{ t.fastners.weightPerMw|f1(4) }}</td>
          <td>{{ t.fastners.weightPercentage|f1(1) }}%</td>
        </tr>
        <tr><td>Others</td>
          <td>{{ t.others.costPerTracker|f1(2) }}</td>
          <td>{{ t.others.costPerWatt|f1(4) }}</td>
          <td>{{ t.others.costPercentage|f1(1) }}%</td>
          <td>{{ t.others.weightTotalTracker|f1(3) }}</td>
          <td>{{ t.others.weightPerMw|f1(4) }}</td>
          <td>{{ t.others.weightPercentage|f1(1) }}%</td>
        </tr>
        <tr style="background-color: #eb7c31"><td>Total</td>
          <td>{{ t.total.costPerTracker|f1(2) }}</td>
          <td>{{ t.total.costPerWatt|f1(4) }}</td>
          <td>{{ t.total.costPercentage|f1(1) }}%</td>
          <td>{{ t.total.weightTotalTracker|f1(3) }}</td>
          <td>{{ t.total.weightPerMw|f1(4) }}</td>
          <td>{{ t.total.weightPercentage|f1(1) }}%</td>
        </tr>
        </tbody>
      </table>
      <br>
    </div>



  </div>
</template>
<script>

//获取柱子列表字符串
export default {
  name: 'ResultComponets',
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {

  },
  filters:{
    f1(value,n){
        if(value === undefined){
          return 0
        }
        return value.toFixed(n)
      },
  },
  //局部过滤器
  // filters:{
  //   fix(value,n){
  //     if(value === undefined){
  //       return 0
  //     }
  //     return value|f1(n)
  //   },
  //   timeFormater(value,str='YYYY年MM月DD日 HH:mm:ss'){
  //     // console.log('@',value)
  //     return dayjs(value).format(str)
  //   },
  // },
  props: {
    cp: {},
  }

}

</script>

<style scoped>
/* CSS样式 */
table {
  margin-left: 10px;
  border-collapse: collapse; /* 确保边框不会重叠 */
  border: 1px solid black; /* 设置表格边框颜色和宽度 */
}

caption {
  text-align: center;
  border: 1px solid black;
  height: 30px;
  font-size: 20px;
}

tr{
  height: 32px;
}
th, td {
  border: 1px solid black; /* 设置表格内部单元格边框颜色和宽度 */
  text-align: center;
}
</style>
