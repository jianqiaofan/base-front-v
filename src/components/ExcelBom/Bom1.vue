<template>
<div class="container-excel-bom">
  <div class="header-info">
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <div class="title">产品型号/Product Type</div>
          <div class="content">{{ objBom.productType }}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <div class="title">倾角坡度/Tilt</div>
          <div class="content">{{ objBom.tilt }}</div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">订单号/Order No.</div>
          <div class="content">{{ objBom.orderNo }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">批次/Batch</div>
          <div class="content">{{ objBom.batch }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">订单套数/Order Sets</div>
          <div class="content">{{ objBom.orderSets }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">阶段/Stage</div>
          <div class="content">{{ objBom.stage }}</div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">组件功率/Module Power</div>
          <div class="content">{{ objBom.modulePower }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">组件布向/Module Placement</div>
          <div class="content">{{ objBom.modulePlacement }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">组件尺寸/Module Size</div>
          <div class="content">{{ objBom.moduleSize }}</div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">
          <div class="title">行数/Rows</div>
          <div class="content">{{ objBom.rows }}</div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">
          <div class="title">列数/Columns</div>
          <div class="content">{{ objBom.columns }}</div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">单套榀数/Structure Pcs</div>
          <div class="content">{{ objBom.structurePcs }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">基础单数/Base Qty</div>
          <div class="content">{{ objBom.baseQty }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">柱脚形式/Column Base</div>
          <div class="content">{{ objBom.columnBase }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">基础类型/Base Type</div>
          <div class="content">{{ objBom.baseType }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
  <h2>主材表</h2>
  <div class="table-main">
    <el-table :data="objBom.mainMaterials" style="width: 100%" :row-class-name="tableRowClassName" stripe border>
      <el-table-column prop="num" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="名称" width="250"></el-table-column>
      <el-table-column prop="partNum" label="件号" width="100"></el-table-column>
      <el-table-column prop="model" label="规格" width="180"></el-table-column>
      <el-table-column prop="lenth" label="长度" width="100" :formatter="formatNumber2"></el-table-column>
      <el-table-column prop="unit" label="单位" width="80"></el-table-column>
      <el-table-column prop="unitQty" label="单数" width="80"></el-table-column>
      <el-table-column prop="totalQty" label="总数" width="80"></el-table-column>
      <el-table-column prop="spareQty" label="备品率" width="80" :formatter="formatNumber2"></el-table-column>
      <el-table-column prop="spareRatio" label="备品数量" width="80"></el-table-column>
      <el-table-column prop="actualQty" label="实际数量" width="100"></el-table-column>
      <el-table-column prop="mass" label="米重" width="100" :formatter="formatNumber3"></el-table-column>
      <el-table-column prop="unitWeight" label="单重" width="100" :formatter="formatNumber3"></el-table-column>
      <el-table-column prop="totalWeight" label="总重" width="120" :formatter="formatNumber3"></el-table-column>
      <el-table-column prop="material" label="材质" width="100"></el-table-column>
      <el-table-column prop="remarks" label="备注" width="200"></el-table-column>

    </el-table>
  </div>
  <h2>螺栓配件</h2>
  <div class="table-fasteners">
    <el-table :data="objBom.fastenersAndAccessories" style="width: 100%" :row-class-name="tableRowClassName" stripe border>
      <el-table-column prop="num" label="序号" width="60"></el-table-column>
      <el-table-column prop="joint" label="部位" width="250"></el-table-column>
      <el-table-column prop="type" label="类型" width="200"></el-table-column>
      <el-table-column prop="model" label="规格" width="100"></el-table-column>
      <el-table-column prop="attachment" label="配套" width="180"></el-table-column>
      <el-table-column prop="unit" label="单位" width="80"></el-table-column>
      <el-table-column prop="unitQty" label="单数" width="80"></el-table-column>
      <el-table-column prop="totalQty" label="总数" width="80"></el-table-column>
      <el-table-column prop="spareQty" label="备品率" width="80" :formatter="formatNumber2"></el-table-column>
      <el-table-column prop="spareRatio" label="备品数量" width="80"></el-table-column>
      <el-table-column prop="actualQty" label="实际数量" width="100"></el-table-column>
      <el-table-column prop="unitWeight" label="单重" width="100" :formatter="formatNumber3"></el-table-column>
      <el-table-column prop="totalWeight" label="总重" width="120" :formatter="formatNumber3"></el-table-column>
      <el-table-column prop="material" label="材质" width="100"></el-table-column>
      <el-table-column prop="remarks" label="备注" width="200"></el-table-column>
    </el-table>
  </div>

  <h2>重量合计:{{structureTotalWeight}} kg</h2>
</div>
</template>

<script>
export default {
  data(){
    return {
    }
  },
  computed:{
    structureTotalWeight(){
      let mainWeight = this.objBom.mainMaterials.reduce((a,b)=>a+b.totalWeight,0)
      let otherWeight = this.objBom.fastenersAndAccessories.reduce((a,b)=>a+b.totalWeight,0)
      return mainWeight+otherWeight
    }
  },

  methods:{
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },

    /**
     * 格式化数字，如果是小数，保留n位小数，如果是整数不处理
     */
    formatNumber2(row, column, cellValue) {
      if (typeof (cellValue) === 'number') {
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

  props:{
    objBom:{
      type:Object,
      require:true,
    }
  }
}

</script>

<style scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #b0d79b;
}

.header-info {
  max-width: 1200px;
}

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}


div.title {
  color: #666666;
  font-size: 12px;
}

div.content {
  font-size: 14px;
}

.info-content {
  font-size: 14px;
  line-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

</style>
