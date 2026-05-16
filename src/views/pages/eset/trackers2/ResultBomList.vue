<template>
  <div style="margin-bottom: 100px">

    <div class="table-caption">{{trackerName}}-主材和标准件</div>
    <el-table
      :data="tableData1"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column prop="num" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="名称" width="150"></el-table-column>
      <el-table-column prop="partNo" label="件号" width="100"></el-table-column>
<!--      <el-table-column prop="specification" label="规格" width="100"></el-table-column>-->
<!--      <el-table-column prop="length" label="长度" width="100"></el-table-column>-->
<!--      <el-table-column prop="unit" label="单位" width="100"></el-table-column>-->
<!--      <el-table-column prop="unitQuantity" label="单数" width="80"></el-table-column>-->
<!--      <el-table-column prop="totalQuantity" label="总数" width="80"></el-table-column>-->
<!--      <el-table-column prop="weightPerMater" label="米重" width="80"></el-table-column>-->
<!--      <el-table-column prop="unitWeight" label="单重" width="80"></el-table-column>-->
<!--      <el-table-column prop="totalWeight" label="总重" width="80"></el-table-column>-->
<!--      <el-table-column prop="unitPrice" label="单价" width="80"></el-table-column>-->
<!--      <el-table-column prop="totalWeight" label="总价" width="100"></el-table-column>-->
<!--      <el-table-column prop="material" label="材质" width="100"></el-table-column>-->
<!--      <el-table-column prop="surfaceTreatment" label="表面处理" width="100"></el-table-column>-->
<!--      <el-table-column prop="costPrice" label="综合单价" width="100"></el-table-column>-->
<!--      <el-table-column prop="remark" label="备注"></el-table-column>-->
    </el-table>

    <div class="table-caption">{{trackerName}}-紧固件</div>
    <el-table
      :data="tableData2"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column prop="num" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="名称" width="150"></el-table-column>
      <el-table-column prop="partNo" label="件号" width="100"></el-table-column>
      <el-table-column prop="specification" label="规格" width="100"></el-table-column>
      <el-table-column prop="length" label="长度" width="100"></el-table-column>
      <el-table-column prop="unit" label="单位" width="100"></el-table-column>
      <el-table-column prop="unitQuantity" label="单数" width="80"></el-table-column>
      <el-table-column prop="totalQuantity" label="总数" width="80"></el-table-column>
      <el-table-column prop="weightPerMater" label="米重" width="80"></el-table-column>
      <el-table-column prop="unitWeight" label="单重" width="80"></el-table-column>
      <el-table-column prop="totalWeight" label="总重" width="80"></el-table-column>
      <el-table-column prop="unitPrice" label="单价" width="80"></el-table-column>
      <el-table-column prop="totalWeight" label="总价" width="100"></el-table-column>
      <el-table-column prop="material" label="材质" width="100"></el-table-column>
      <el-table-column prop="surfaceTreatment" label="表面处理" width="100"></el-table-column>
      <el-table-column prop="costPrice" label="综合单价" width="100"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
    </el-table>

    <div class="table-caption">{{trackerName}}-电气&机械</div>
    <el-table
      :data="tableData3"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column prop="num" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="名称" width="150"></el-table-column>
      <el-table-column prop="partNo" label="件号" width="100"></el-table-column>
      <el-table-column prop="specification" label="规格" width="200"></el-table-column>
      <el-table-column prop="length" label="长度" width="100"></el-table-column>
      <el-table-column prop="unit" label="单位" width="100"></el-table-column>
      <el-table-column prop="unitQuantity" label="单数" width="80"></el-table-column>
      <el-table-column prop="totalQuantity" label="总数" width="80"></el-table-column>
      <el-table-column prop="weightPerMater" label="米重" width="80"></el-table-column>
      <el-table-column prop="unitWeight" label="单重" width="80"></el-table-column>
      <el-table-column prop="totalWeight" label="总重" width="80"></el-table-column>
      <el-table-column prop="unitPrice" label="单价" width="80"></el-table-column>
      <el-table-column prop="totalWeight" label="总价" width="100"></el-table-column>
      <el-table-column prop="material" label="材质" width="100"></el-table-column>
      <el-table-column prop="surfaceTreatment" label="表面处理" width="100"></el-table-column>
      <el-table-column prop="costPrice" label="综合单价" width="100"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
    </el-table>

    <div v-if="tableDataErr.length>0" class="table-caption">{{trackerName}}-计算提示</div>
    <el-table
      :data="tableDataErr"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column prop="num" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="名称" width="100"></el-table-column>
      <el-table-column prop="partNo" label="件号" width="100"></el-table-column>
      <el-table-column prop="specification" label="规格" width="100"></el-table-column>
      <el-table-column prop="length" label="长度" width="100"></el-table-column>
      <el-table-column prop="unit" label="单位" width="100"></el-table-column>
      <el-table-column prop="unitQuantity" label="单数" width="100"></el-table-column>
      <el-table-column prop="totalQuantity" label="总数" width="100"></el-table-column>
      <el-table-column prop="weightPerMater" label="米重" width="100"></el-table-column>
      <el-table-column prop="unitWeight" label="单重" width="100"></el-table-column>
      <el-table-column prop="totalWeight" label="总重" width="100"></el-table-column>
      <el-table-column prop="unitPrice" label="单价" width="100"></el-table-column>
      <el-table-column prop="totalWeight" label="总价" width="100"></el-table-column>
      <el-table-column prop="material" label="材质" width="100" ></el-table-column>
      <el-table-column prop="surfaceTreatment" label="表面处理" width="100"></el-table-column>
      <el-table-column prop="costPrice" label="综合单价" width="100"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
    </el-table>
    <el-divider></el-divider>
  </div>

</template>



<script>
export default {

  data() {
    return {
      bom1: this.boms[0].bomShow1,
      bom2: this.boms[0].bomShow2,
      bom3: this.boms[0].bomShow3,
      bomErr: this.boms[0].bomShowErr
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    bomFormat(bomList){
      let b = bomList
      for (let i = 0; i < b.length; i++) {
        b[i].unitPrice= b[i].unitPrice>0?parseFloat(b[i].unitPrice.toFixed(2)):""
        b[i].totalPrice= b[i].totalPrice>0?parseFloat(b[i].totalPrice.toFixed(2)):""
        b[i].unitWeight= b[i].unitWeight>0?parseFloat(b[i].unitWeight.toFixed(3)):""
        b[i].totalWeight= b[i].totalWeight>0?parseFloat(b[i].totalWeight.toFixed(3)):""
        b[i].weightPerMater= b[i].totalWeight>0?parseFloat(b[i].totalWeight):""
      }
      return b
    },
  },
  computed:{
    tableData1(){
      //methods要入在computed前面，否则bomFormat函数找不到
      return this.bomFormat(this.bom1)
    },
    tableData2(){
      return this.bomFormat(this.bom2)
    },
    tableData3(){
      return this.bomFormat(this.bom3)
    },
    tableDataErr(){
      return this.bomErr
    },
  },
  props: {
    boms:{},
    trackerName:''
  },

}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.table-caption {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
  /* 根据需要添加更多样式 */
}
</style>
