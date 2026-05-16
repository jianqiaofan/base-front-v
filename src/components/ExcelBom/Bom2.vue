<template>
  <div class="container-excel-bom">
    <div class="header-info">
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <div class="title">产品型号/Product Type</div>
            <div class="content">{{ theBom.productType }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <div class="title">倾角坡度/Tilt</div>
            <div class="content">{{ theBom.tilt }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="title">订单号/Order No.</div>
            <div class="content">{{ theBom.orderNo }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="title">批次/Batch</div>
            <div class="content">{{ theBom.batch }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="title">订单套数/Order Sets</div>
            <div class="content">{{ theBom.orderSets }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="title">阶段/Stage</div>
            <div class="content">{{ theBom.stage }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="title">组件功率/Module Power</div>
            <div class="content">{{ theBom.modulePower }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="title">组件布向/Module Placement</div>
            <div class="content">{{ theBom.modulePlacement }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="title">组件尺寸/Module Size</div>
            <div class="content">{{ theBom.moduleSize }}</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <div class="title">行数/Rows</div>
            <div class="content">{{ theBom.rows }}</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <div class="title">列数/Columns</div>
            <div class="content">{{ theBom.columns }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="title">单套榀数/Structure Pcs</div>
            <div class="content">{{ theBom.structurePcs }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="title">基础单数/Base Qty</div>
            <div class="content">{{ theBom.baseQty }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="title">柱脚形式/Column Base</div>
            <div class="content">{{ theBom.columnBase }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="title">基础类型/Base Type</div>
            <div class="content">{{ theBom.baseType }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <h2>主材表</h2>
    <div class="table-main">
      <el-table :data="theBom.mainMaterials" style="width: 100%" :row-class-name="tableRowClassName" stripe border>
        <el-table-column prop="num" label="序号" width="60"></el-table-column>
        <el-table-column prop="name" label="名称" width="250"></el-table-column>
        <el-table-column prop="partNum" label="件号" width="100"></el-table-column>
        <el-table-column prop="model" label="规格" width="180"></el-table-column>
        <el-table-column prop="lenth" label="长度" width="100"></el-table-column>
        <el-table-column prop="unit" label="单位" width="80"></el-table-column>
        <el-table-column prop="unitQty" label="单数" width="80"></el-table-column>
        <el-table-column prop="totalQty" label="总数" width="80"></el-table-column>
        <el-table-column prop="spareQty" label="备品率" width="80" :formatter="formatNumber2"></el-table-column>
        <el-table-column prop="spareRatio" label="备品数量" width="80"></el-table-column>
        <el-table-column prop="actualQty" label="实际数量" width="100"></el-table-column>
<!--        <el-table-column prop="mass" label="米重" width="100" :formatter="formatNumber3"></el-table-column>-->
<!--        <el-table-column prop="unitWeight" label="单重" width="100" :formatter="formatNumber3"></el-table-column>-->
<!--        <el-table-column prop="totalWeight" label="总重" width="120" :formatter="formatNumber3"></el-table-column>-->
        <el-table-column prop="material" label="材质" width="100"></el-table-column>
        <el-table-column prop="remarks" label="备注" width="200"></el-table-column>

        <el-table-column label="发货地" width="100" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.dispatchPlace" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="材料单价" width="100" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.rawPrice" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="加工单价" width="100" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.processFee" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="镀锌单价" width="100" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.galvanizedFee" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="包装单价" width="100" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.packageFee" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="装箱" width="100" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.packageBoxFee" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="综合单价" width="120" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.comprehensivePrice" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="总价" width="150" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.totalPrice" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="150" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.priceRemark" size="mini"></el-input>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <h2>螺栓配件</h2>
    <div class="table-fasteners">
      <el-table :data="theBom.fastenersAndAccessories" style="width: 100%" :row-class-name="tableRowClassName" stripe border>
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
<!--        <el-table-column prop="unitWeight" label="单重" width="100" :formatter="formatNumber3"></el-table-column>-->
<!--        <el-table-column prop="totalWeight" label="总重" width="120" :formatter="formatNumber3"></el-table-column>-->
        <el-table-column prop="material" label="材质" width="100"></el-table-column>
        <el-table-column prop="remarks" label="备注" width="200"></el-table-column>

        <el-table-column label="发货地" width="100" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.dispatchPlace" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="材料单价" width="100" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.rawPrice" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="加工单价" width="100" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.processFee" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="镀锌单价" width="100" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.galvanizedFee" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="包装单价" width="100" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.packageFee" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="装箱" width="100" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.packageBoxFee" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="综合单价" width="120" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.comprehensivePrice" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="总价" width="150" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.totalPrice" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="150" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.priceRemark" size="mini"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <h2>重量合计:{{ structureTotalWeight }} kg</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theBom:{}
    }
  },
  computed: {
    structureTotalWeight() {
      let mainWeight = this.theBom.mainMaterials.reduce((a, b) => a + b.totalWeight, 0)
      let otherWeight = this.theBom.fastenersAndAccessories.reduce((a, b) => a + b.totalWeight, 0)
      return mainWeight + otherWeight
    }
  },

  methods: {
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

  props: {
    objBom: {
      type: Object,
      require: true
    }
  },
  mounted(){
    this.theBom = this.objBom
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
