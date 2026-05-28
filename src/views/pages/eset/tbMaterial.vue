<template>
  <div class="app-container">
    <div class="search-div">
      <el-form :inline="true" label-width="70px" size="small" class="material-search-form">
        <el-form-item label="名称">
          <el-input
            v-model="searchObj.productName"
            placeholder="名称"
            clearable
            class="material-search-form__control"
          />
        </el-form-item>
        <el-form-item label="编号">
          <el-input
            v-model="searchObj.productCode"
            placeholder="编号"
            clearable
            class="material-search-form__control"
          />
        </el-form-item>
        <el-form-item label="材料分类" prop="productCategory">
          <el-select
            v-model="searchObj.productCategory"
            clearable
            placeholder="请选择"
            class="material-search-form__control"
          >
            <el-option label="减速机" value="Drives System"></el-option>
            <el-option label="控制系统" value="Control System"></el-option>
            <el-option label="阻尼器" value="Damper"></el-option>
            <el-option label="立柱" value="Post"></el-option>
            <el-option label="主梁" value="Torque Tube"></el-option>
            <el-option label="檩条" value="Purlin"></el-option>
            <el-option label="冲压件" value="Stamping Parts"></el-option>
            <el-option label="铸造件" value="Casting Part"></el-option>
            <el-option label="紧固件" value="Fastners"></el-option>
            <el-option label="气象通信站" value="Weather Station"></el-option>
            <el-option label="其它" value="Other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计价方式">
          <el-select
            v-model="searchObj.pricingMethod"
            clearable
            filterable
            placeholder="请选择"
            class="material-search-form__control"
          >
            <el-option
              v-for="item in pricing_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="material-search-form__actions">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add"
                 :disabled="$hasBP('bnt.tbMaterial.add')  === false"
      >添 加
      </el-button>
      <el-button style="margin-left:8px" size="mini" :disabled="$hasBP('bnt.tbMaterial.list')  === false" type="primary"
                 @click="exportData"
      >导出数据
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      :row-key="getRowKeys"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="序号"
        width="70"
        align="center"
      >
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="productCategory" label="产品类别" width="120"/>
      <el-table-column sortable prop="productName" label="材料名称"/>
      <el-table-column sortable prop="productCode" label="产品编号"/>
      <el-table-column sortable prop="specification" label="规格"/>
      <el-table-column sortable prop="material" label="材质" width="140"/>
      <el-table-column sortable prop="unit" label="单位" width="80"/>
      <el-table-column sortable prop="unitWeight" label="单重" width="100"/>
      <el-table-column sortable prop="pricingMethod" label="计价方式"/>

      <el-table-column sortable prop="unitPriceGradeC3" label="C3单价"/>
      <el-table-column sortable prop="unitPriceGradeC4" label="C4单价"/>
      <el-table-column sortable prop="unitPriceGradeC5" label="C5单价"/>

      <el-table-column sortable prop="corrosionProofingGradeC3" label="C3防腐要求"/>
      <el-table-column sortable prop="corrosionProofingGradeC4" label="C4防腐要求"/>
      <el-table-column sortable prop="corrosionProofingGradeC5" label="C5防腐要求"/>

      <el-table-column sortable prop="updateTime" label="修改时间"/>
      <el-table-column type="expand" label="...">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="材料名称"><span>{{ props.row.productName }}</span></el-form-item>
            <el-form-item label="产品类别"><span>{{ props.row.productCategory }}</span></el-form-item>
            <el-form-item label="产品编号"><span>{{ props.row.productCode }}</span></el-form-item>
            <el-form-item label="规格"><span>{{ props.row.specification }}</span></el-form-item>
            <el-form-item label="规格"><span>{{ props.row.material }}</span></el-form-item>
            <el-form-item label="单位"><span>{{ props.row.unit }}</span></el-form-item>
            <el-form-item label="单重"><span>{{ props.row.unitWeight }}</span></el-form-item>
            <el-form-item label="计价方式"><span>{{ props.row.pricingMethod }}</span></el-form-item>

            <el-form-item label="C3单价"><span>{{ props.row.unitPriceGradeC3 }}</span></el-form-item>
            <el-form-item label="C4单价"><span>{{ props.row.unitPriceGradeC4 }}</span></el-form-item>
            <el-form-item label="C5单价"><span>{{ props.row.unitPriceGradeC5 }}</span></el-form-item>

            <el-form-item label="C3防腐要求"><span>{{ props.row.corrosionProofingGradeC3 }}</span></el-form-item>
            <el-form-item label="C4防腐要求"><span>{{ props.row.corrosionProofingGradeC4 }}</span></el-form-item>
            <el-form-item label="C5防腐要求"><span>{{ props.row.corrosionProofingGradeC5 }}</span></el-form-item>

            <el-form-item label="创建时间"><span>{{ props.row.createTime }}</span></el-form-item>
            <el-form-item label="修改时间"><span>{{ props.row.updateTime }}</span></el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)"
                     :disabled="$hasBP('bnt.tbMaterial.update')  === false" title="修改"
          />
          <!--          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)"-->
          <!--                     :disabled="$hasBP('bnt.tbMaterial.remove')  === false" title="删除"-->
          <!--          />-->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="sizeChangeHandle"
      :current-page="page"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center;"
      :page-sizes="[10, 20, 50, 100]"
      layout="total,sizes, prev, pager, next, jumper"
      @current-change="fetchData"
    />
    <el-dialog title="添加111/修改" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="tbMaterial" label-width="100px" size="small"
               style="padding-right: 40px;"
      >
        <el-form-item label="材料名称" prop="name">
          <el-input v-model="tbMaterial.productName" clearable/>
        </el-form-item>
        <el-form-item label="产品类别" prop="productCategory">
          <el-input v-model="tbMaterial.productCategory" disabled/>
        </el-form-item>
        <el-form-item label="产品编号" prop="productCode">
          <el-input v-model="tbMaterial.productCode" disabled/>
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="tbMaterial.specification"/>
        </el-form-item>
        <el-form-item label="材质" prop="material">
          <el-input v-model="tbMaterial.material"/>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="tbMaterial.unit" clearable/>
        </el-form-item>
        <el-form-item label="单重" prop="unitWeight">
          <el-input v-model="tbMaterial.unitWeight" clearable/>
        </el-form-item>
        <el-form-item label="计价方式" prop="pricingMethod">
          <el-select v-model="tbMaterial.pricingMethod" @change="methodChange" placeholder="请选择">
            <el-option
              v-for="item in pricing_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="C3单价" prop="unitPriceGradeC3">
          <el-input v-model="tbMaterial.unitPriceGradeC3" :disabled="needPrice"/>
        </el-form-item>
        <el-form-item label="C4单价" prop="unitPriceGradeC4">
          <el-input v-model="tbMaterial.unitPriceGradeC4" :disabled="needPrice"/>
        </el-form-item>
        <el-form-item label="C5单价" prop="unitPriceGradeC5">
          <el-input v-model="tbMaterial.unitPriceGradeC5" :disabled="needPrice"/>
        </el-form-item>
        <el-form-item label="C3防腐要求" prop="corrosionProofingGradeC3">
          <el-input v-model="tbMaterial.corrosionProofingGradeC3" :disabled="needPrice"/>
        </el-form-item>
        <el-form-item label="C4防腐要求" prop="corrosionProofingGradeC4">
          <el-input v-model="tbMaterial.corrosionProofingGradeC4" :disabled="needPrice"/>
        </el-form-item>
        <el-form-item label="C5防腐要求" prop="corrosionProofingGradeC5">
          <el-input v-model="tbMaterial.corrosionProofingGradeC5" :disabled="needPrice"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import api from '@/api/eset/tbMaterial'

const defaultForm = {}
export default {
  components: {},
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: [], // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 20, // 每页记录数
      searchObj: {}, // 查询表单对象
      dialogVisible: false,
      tbMaterial: defaultForm,
      thePricingMethod: '',
      saveBtnDisabled: false,
      needPrice: true,//是否需要填价格(只有按单件计价时才需要)
      pricing_options:[
        {label:'按单件计价',value:'按单件计价'},
        {label:'按H型钢计价',value:'按H型钢计价'},
        {label:'按锌铝镁主梁计价',value:'按锌铝镁主梁计价'},
        {label:'按锌铝镁檩条计价',value:'按锌铝镁檩条计价'},
        {label:'冲压件-S250GD-ZM',value:'冲压件-S250GD-ZM'},
        {label:'冲压件-S350GD-ZM',value:'冲压件-S350GD-ZM'},
        {label:'铸造件-QT450-10',value:'铸造件-QT450-10'},
        {label:'紧固件-6.8',value:'紧固件-6.8'},
        {label:'紧固件-8.8',value:'紧固件-8.8'},
        {label:'紧固件-SU304',value:'紧固件-SU304'},
        {label:'钢加工件-Q235B',value:'钢加工件-Q235B'},
        {label:'钢加工件-Q355B',value:'钢加工件-Q355B'},
        {label:'钢加工件-Q420',value:'钢加工件-Q420'},
        {label:'钢加工件-Q460',value:'钢加工件-Q460'},
        {label:'钢加工件-RG60',value:'钢加工件-RG60'},
        {label:'钢加工件-GR65',value:'钢加工件-GR65'}
      ],
      rules: {}
    }
  },
  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    this.fetchData()
  },
  // 生命周期函数：内存准备完毕，页面渲染成功
  mounted() {
  },
  methods: {
    handleChange(e) {

      // if(Array.isArray(e)){
      //   this.tbMaterial.pricingMethod = e[e.length]
      // } else {
      //   this.tbMaterial.pricingMethod = e
      // }
      console.log('12345', this.thePricingMethod)
    },
    getRowKeys(row) {
      return row.id
    },
    //导出数据
    exportData() {
      window.open(process.env.VUE_APP_BASE_API + '/eset/tbMaterial/export?token=' + getToken())
    },
    // 每页数
    sizeChangeHandle(val) {
      this.limit = val
      this.page = 1
      this.fetchData(this.page)
    },
    //复选框发生变化执行方法
    handleSelectionChange(selection) {
      this.selectValue = selection
      //console.log(this.selectValue)
    },
    // 加载banner列表数据
    fetchData(page = 1) {
      debugger
      this.page = page
      api.getPageList(this.page, this.limit, this.searchObj).then(
        response => {
          //this.list = response.data.list
          this.list = response.data.records
          this.total = response.data.total
          // 数据加载并绑定成功
          this.listLoading = false
        }
      )
    },
    // 重置查询表单
    resetData() {
      console.log('重置查询表单')
      this.searchObj = {}
      this.fetchData()
    },
    // 根据id删除数据
    removeDataById(id) {
      // debugger
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return api.removeById(id)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '删除成功')
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    //弹出添加表单
    add(row) {
      this.dialogVisible = true
      if (this.$refs.zdept) {
        this.$refs.zdept.reset_data()
      }
      this.tbMaterial = {}
    },
    //编辑
    edit(id) {
      this.dialogVisible = true
      api.getById(id).then(response => {
        this.$nextTick(function() {
          this.tbMaterial = response.data
          this.thePricingMethod = this.tbMaterial.pricingMethod
          if (this.$refs.zdept) {
            this.$refs.zdept.reset_data(this.tbMaterial.deptName)
          }
          if (this.$refs.eltreeDept) {
            this.$refs.eltreeDept.setCheckedKeys(this.tbMaterial.deptIdList)
          }
        })
      })
    },
    //添加或更新
    saveOrUpdate() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          if (!this.tbMaterial.id) {
            this.save()
          } else {
            this.update()
          }
        }
      })
    },
    //添加
    save() {
      api.save(this.tbMaterial).then(response => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },
    //更新
    update() {
      api.updateById(this.tbMaterial).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },
    methodChange(value){
        this.needPrice = value !== '按单件计价'
    }
  }
}
</script>
<style scoped>
.material-search-form ::v-deep .el-form-item {
  margin-right: 12px;
  margin-bottom: 8px;
}

.material-search-form__control {
  width: 160px;
}

.material-search-form__actions ::v-deep .el-form-item__content {
  margin-left: 0 !important;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>


