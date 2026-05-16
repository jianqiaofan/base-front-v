<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="生产地">
              <el-select v-model="searchObj.site" placeholder="请选择生产地" clearable>
                <el-option value="国内">国内生产</el-option>
                <el-option value="沙特">沙特吉达</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="厚度">
              <el-input v-model="searchObj.thickness" placeholder="厚度" clearable/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add"
                 :disabled="$hasBP('bnt.tbPriceYehui.add')  === false"
      >添 加
      </el-button>
      <el-button style="margin-left:8px" size="mini" :disabled="$hasBP('bnt.tbPriceYehui.list')  === false" type="primary"
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
      <el-table-column width="80" sortable prop="site" label="产地"/>
      <el-table-column width="120" sortable prop="thickness" label="原材厚度"/>
      <el-table-column width="70" prop="rawPrice350" label="S350"/>
      <el-table-column width="70" prop="rawPrice420" label="S420"/>
      <el-table-column width="70" prop="rawPrice450" label="S450"/>
      <el-table-column width="70" prop="rawPrice550" label="S550"/>

      <el-table-column width="80" prop="galvanizing275" label="镀锌 275"/>
      <el-table-column width="80" prop="galvanizing310" label="镀锌 310"/>
      <el-table-column width="80" prop="galvanizing350" label="镀锌 350"/>
      <el-table-column width="80" prop="galvanizing450" label="镀锌 450"/>
      <el-table-column width="80" prop="galvanizing475" label="镀锌 475"/>

      <el-table-column width="100" prop="utilizationRateBeam" label="主梁利用率"/>
      <el-table-column width="100" prop="utilizationRatePurlin" label="檩条利用率"/>
      <el-table-column width="100" prop="processingFeeBeam" label="主梁加工费"/>
      <el-table-column width="100" prop="processingFeePurlin" label="檩条加工费"/>
      <el-table-column width="100" prop="packagingFeeBeam" label="主梁包装费"/>
      <el-table-column width="100" prop="packagingFeePurlin" label="檩条包装费"/>
      <!--      <el-table-column width="70" prop="importTariff" label="出口退税"/>-->
      <!--      <el-table-column width="70" prop="oceanFreight" label="海运费"/>-->

      <el-table-column type="expand" label="...">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="生产地"><span>{{ props.row.site }}</span></el-form-item>
            <el-form-item label="厚度"><span>{{ props.row.thickness }}</span></el-form-item>
            <el-form-item label="S350"><span>{{ props.row.rawPrice350 }}</span></el-form-item>
            <el-form-item label="S420"><span>{{ props.row.rawPrice420 }}</span></el-form-item>
            <el-form-item label="S450"><span>{{ props.row.rawPrice450 }}</span></el-form-item>
            <el-form-item label="S550"><span>{{ props.row.rawPrice550 }}</span></el-form-item>

            <el-form-item label="镀锌275"><span>{{ props.row.rawPrice275 }}</span></el-form-item>
            <el-form-item label="镀锌310"><span>{{ props.row.rawPrice310 }}</span></el-form-item>
            <el-form-item label="镀锌350"><span>{{ props.row.rawPrice350 }}</span></el-form-item>
            <el-form-item label="镀锌450"><span>{{ props.row.rawPrice450 }}</span></el-form-item>
            <el-form-item label="镀锌475"><span>{{ props.row.rawPrice475 }}</span></el-form-item>

            <el-form-item label="主梁利用率"><span>{{ props.row.utilizationRateBeam }}</span></el-form-item>
            <el-form-item label="檩条利用率"><span>{{ props.row.utilizationRatePurlin }}</span></el-form-item>
            <el-form-item label="主梁加工费"><span>{{ props.row.processingFeeBeam }}</span></el-form-item>
            <el-form-item label="檩条加工费"><span>{{ props.row.processingFeePurlin }}</span></el-form-item>
            <el-form-item label="主梁包装费"><span>{{ props.row.packagingFeeBeam }}</span></el-form-item>
            <el-form-item label="檩条包装费"><span>{{ props.row.packagingFeePurlin }}</span></el-form-item>
            <!--            <el-form-item label="出口退税"><span>{{ props.row.exportTaxRebate }}</span></el-form-item>-->
            <!--            <el-form-item label="进口关税"><span>{{ props.row.importTariff }}</span></el-form-item>-->
            <!--            <el-form-item label="海运费"><span>{{ props.row.oceanFreight }}</span></el-form-item>-->

            <el-form-item label="创建时间"><span>{{ props.row.createTime }}</span></el-form-item>
            <el-form-item label="修改时间"><span>{{ props.row.updateTime }}</span></el-form-item>
          </el-form>

        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)"
                     :disabled="$hasBP('bnt.tbPriceYehui.update')  === false" title="修改"
          />
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)"
                     :disabled="$hasBP('bnt.tbPriceYehui.remove')  === false" title="删除"
          />
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
      :page-sizes="[5, 10, 50, 100]"
      layout="total,sizes, prev, pager, next, jumper"
      @current-change="fetchData"
    />
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="tbPriceYehui" :rules="rules" label-width="100px" size="small"
               style="padding-right: 40px;"
      >
        <el-form-item label="生产地" prop="site">
          <el-select v-model="tbPriceYehui.site" placeholder="请选择生产地">
            <el-option value="国内">国内生产</el-option>
            <el-option value="沙特">沙特吉达</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="材料厚度" prop="thickness"><el-input v-model="tbPriceYehui.thickness" /></el-form-item>
        <el-form-item label="S350" prop="rawPrice350"><el-input v-model="tbPriceYehui.rawPrice350" /></el-form-item>
        <el-form-item label="S420" prop="rawPrice420"><el-input v-model="tbPriceYehui.rawPrice420" /></el-form-item>
        <el-form-item label="S450" prop="rawPrice450"><el-input v-model="tbPriceYehui.rawPrice450" /></el-form-item>
        <el-form-item label="S550" prop="rawPrice550"><el-input v-model="tbPriceYehui.rawPrice550" /></el-form-item>

        <el-form-item label="镀锌275" prop="galvanizing275"><el-input v-model="tbPriceYehui.galvanizing275" /></el-form-item>
        <el-form-item label="镀锌310" prop="galvanizing310"><el-input v-model="tbPriceYehui.galvanizing310" /></el-form-item>
        <el-form-item label="镀锌350" prop="galvanizing350"><el-input v-model="tbPriceYehui.galvanizing350" /></el-form-item>
        <el-form-item label="镀锌450" prop="galvanizing450"><el-input v-model="tbPriceYehui.galvanizing450" /></el-form-item>
        <el-form-item label="镀锌475" prop="galvanizing475"><el-input v-model="tbPriceYehui.galvanizing475" /></el-form-item>

        <el-form-item label="主梁利用率" prop="utilizationRateBeam"><el-input v-model="tbPriceYehui.utilizationRateBeam" /></el-form-item>
        <el-form-item label="檩条利用率" prop="utilizationRatePurlin"><el-input v-model="tbPriceYehui.utilizationRatePurlin" /></el-form-item>
        <el-form-item label="主梁加工费" prop="processingFeeBeam"><el-input v-model="tbPriceYehui.processingFeeBeam" /></el-form-item>
        <el-form-item label="檩条加工费" prop="processingFeePurlin"><el-input v-model="tbPriceYehui.processingFeePurlin" /></el-form-item>
        <el-form-item label="主梁包装费" prop="packagingFee"><el-input v-model="tbPriceYehui.packagingFeeBeam" /></el-form-item>
        <el-form-item label="檩条包装费" prop="packagingFee"><el-input v-model="tbPriceYehui.packagingFeePurlin" /></el-form-item>
        <!--        <el-form-item label="出口退税" prop="exportTaxRebate"><el-input v-model="tbPriceYehui.exportTaxRebate"/></el-form-item>-->
        <!--        <el-form-item label="进口关税" prop="importTariff"><el-input v-model="tbPriceYehui.importTariff"/></el-form-item>-->
        <!--        <el-form-item label="海运费" prop="oceanFreight"><el-input v-model="tbPriceYehui.oceanFreight"/></el-form-item>-->

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
import api from '@/api/eset/tbPriceYehui'

const defaultForm = {}
export default {
  components: {},
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: [], // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 50, // 每页记录数
      searchObj: {}, // 查询表单对象
      dialogVisible: false,
      tbPriceYehui: defaultForm,
      saveBtnDisabled: false,
      selectValue: [] //复选框选择内容封装数组
      , rules: {
        name:
          [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
      }
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
    getRowKeys(row) {
      return row.id
    },
    //导出数据
    exportData() {
      window.open(process.env.VUE_APP_BASE_API + '/eset/tbPriceYehui/export?token=' + getToken())
    },
    // 每页数
    sizeChangeHandle(val) {
      this.limit = val
      this.page = 1
      this.fetchData(this.page)
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
    //复选框发生变化执行方法
    handleSelectionChange(selection) {
      this.selectValue = selection
      //console.log(this.selectValue)
    },
    //批量删除
    batchRemove() {
      //判断
      if (this.selectValue.length == 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //数组
        var idList = []
        //获取多个复选框对应id，封装到数组里面
        // [1,2,3]
        for (var i = 0; i < this.selectValue.length; i++) {
          var obj = this.selectValue[i]
          //id值
          var id = obj.id
          //放到数组里面
          idList.push(id)
        }
        api.batchRemove(idList).then(response => {
          //提示
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          //刷新
          this.fetchData()
        })
      })
    },
    //弹出添加表单
    add(row) {
      this.dialogVisible = true
      if (this.$refs.zdept) {
        this.$refs.zdept.reset_data()
      }
      this.tbPriceYehui = {}
      this.rules.name = [{ required: true, message: '请输入名称', trigger: 'blur' }]
    },
    //编辑
    edit(id) {
      this.dialogVisible = true
      this.rules.name = [{ required: true, message: '请输入名称', trigger: 'blur' }]
      api.getById(id).then(response => {
        this.$nextTick(function() {
          this.tbPriceYehui = response.data
          if (this.$refs.zdept) {
            this.$refs.zdept.reset_data(this.tbPriceYehui.deptName)
          }
          if (this.$refs.eltreeDept) {
            this.$refs.eltreeDept.setCheckedKeys(this.tbPriceYehui.deptIdList)
          }
        })
      })
    },
    //添加或更新
    saveOrUpdate() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          if (!this.tbPriceYehui.id) {
            this.save()
          } else {
            this.update()
          }
        }
      })
    },
    //添加
    save() {
      api.save(this.tbPriceYehui).then(response => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },
    //更新
    update() {
      api.updateById(this.tbPriceYehui).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    }
  }
}
</script>
<style scoped>
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
