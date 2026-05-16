<template>
  <div>
    <el-divider></el-divider>
      <table>
        <caption>
          <label>Total</label>
        </caption>
        <thead>
        <tr style="background-color: #7a7a7a;color: white">
          <td style="width:120px">RMB(元/kg)</td>
          <td style="width:120px">Componets</td>
          <td style="width:120px">Cost Per Tracker(RMB)</td>
          <td style="width:120px">Cost Per Watt(RMB)</td>
          <td style="width:120px">Cost Percentage</td>
          <td style="width:120px">Weight total Tracker(Kg)</td>
          <td style="width:120px">Weight Per MW</td>
          <td style="width:120px">Weight Percentage</td>
          <td style="width:120px">Tariff</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="t in tcp">
          <td>{{ t.rmbPerKg|f1(2) }}</td>
          <td style="background-color: #00af4f">{{ t.componets }}</td>
          <td>{{ t.costPerTracker|f1(2) }}</td>
          <td>{{ t.costPerWatt|f1(4) }}</td>
          <td>{{ t.costPercentage|f1(2) }}</td>
          <td>{{ t.weightTotalTracker|f1(3) }}</td>
          <td>{{ t.weightPerMw|f1(5) }}</td>
          <td>{{ t.weightPercentage|f1(2) }}</td>
          <td>{{ t.tariff }}</td>
        </tr>
        </tbody>
      </table>
      <br>


  </div>
</template>
<script>

//获取柱子列表字符串
export default {
  name: 'ResultComponetTotal',
  data() {
    return {}
  },
  computed: {},
  methods: {},
  filters: {
    f1(value, n) {
      if (value === undefined) {
        return 0
      }
      return value.toFixed(n)
    }
  },
  props: {
    tcp: {}
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

tr {
  height: 32px;
}

th, td {
  border: 1px solid black; /* 设置表格内部单元格边框颜色和宽度 */
  text-align: center;
}
</style>
