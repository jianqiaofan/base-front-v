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
            <el-form-item label="截面">
              <el-input v-model="searchObj.section" placeholder="截面" clearable/>
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
                 :disabled="$hasBP('bnt.tbPricePost.add')  === false"
      >添 加
      </el-button>
      <el-button style="margin-left:8px" size="mini" :disabled="$hasBP('bnt.tbPricePost.list')  === false" type="primary"
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
      <el-table-column width="140" sortable prop="section" label="截面名称"/>
      <el-table-column width="70" prop="rawPrice235" label="Q235"/>
      <el-table-column width="70" prop="rawPrice355" label="Q355"/>
      <el-table-column width="100" prop="rawPrice420" label="Q420"/>
      <el-table-column width="100" prop="rawPrice460" label="Q460"/>
      <el-table-column width="100" prop="rawPriceGr50" label="A572G R50"/>
      <el-table-column width="100" prop="rawPriceGr65" label="A572G R65"/>
      <el-table-column width="100" prop="galvanizing65" label="镀锌65"/>
      <el-table-column width="100" prop="galvanizing85" label="镀锌85"/>
      <el-table-column width="100" prop="galvanizing100" label="镀锌100"/>
      <el-table-column width="100" prop="galvanizing120" label="镀锌120"/>
      <el-table-column width="100" prop="utilizationRate" label="利用率"/>
      <el-table-column width="100" prop="processingFee" label="加工费"/>
      <el-table-column width="100" prop="packagingFee" label="包装费"/>
      <el-table-column width="120" prop="processingFeeFlange" label="带法兰加工费"/>
<!--      <el-table-column width="100" prop="exportTaxRebate" label="出口退税"/>-->
<!--      <el-table-column width="100" prop="importTariff" label="关税"/>-->
<!--      <el-table-column width="100" prop="oceanFreight" label="海运费"/>-->

      <el-table-column type="expand" label="...">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="生产地"><span>{{ props.row.site }}</span></el-form-item>
            <el-form-item label="截面名称"><span>{{ props.row.section }}</span></el-form-item>
            <el-form-item label="Q235"><span>{{ props.row.rawPrice235 }}</span></el-form-item>
            <el-form-item label="Q355"><span>{{ props.row.rawPrice355 }}</span></el-form-item>
            <el-form-item label="Q420"><span>{{ props.row.rawPrice420 }}</span></el-form-item>
            <el-form-item label="Q460"><span>{{ props.row.rawPrice460 }}</span></el-form-item>

            <el-form-item label="GR60"><span>{{ props.row.xrawPriceGr50 }}</span></el-form-item>
            <el-form-item label="GR65"><span>{{ props.row.rawPriceGr65 }}</span></el-form-item>

            <el-form-item label="镀锌65"><span>{{ props.row.rawPriceGr65 }}</span></el-form-item>
            <el-form-item label="镀锌85"><span>{{ props.row.rawPrice85 }}</span></el-form-item>
            <el-form-item label="镀锌100"><span>{{ props.row.rawPrice100 }}</span></el-form-item>
            <el-form-item label="镀锌120"><span>{{ props.row.rawPrice120 }}</span></el-form-item>

            <el-form-item label="利用率"><span>{{ props.row.utilizationRate }}</span></el-form-item>
            <el-form-item label="加工费"><span>{{ props.row.processingFee }}</span></el-form-item>
            <el-form-item label="带法兰加工费"><span>{{ props.row.processingFeeFlange }}</span></el-form-item>
            <el-form-item label="包装费"><span>{{ props.row.packagingFee }}</span></el-form-item>
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
                     :disabled="$hasBP('bnt.tbPricePost.update')  === false" title="修改"
          />
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)"
                     :disabled="$hasBP('bnt.tbPricePost.remove')  === false" title="删除"
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
      <el-form ref="dataForm" :model="tbPricePost" :rules="rules" label-width="100px" size="small"
               style="padding-right: 40px;"
      >
        <el-form-item label="生产地" prop="site">
          <el-select v-model="tbPricePost.site" placeholder="请选择生产地">
            <el-option value="国内">国内生产</el-option>
            <el-option value="沙特">沙特吉达</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截面名称" prop="section"><el-input v-model="tbPricePost.section" clearable/></el-form-item>
        <el-form-item label="Q235" prop="section"><el-input v-model="tbPricePost.rawPrice235" clearable/></el-form-item>
        <el-form-item label="Q355" prop="section"><el-input v-model="tbPricePost.rawPrice355" clearable/></el-form-item>
        <el-form-item label="Q420" prop="section"><el-input v-model="tbPricePost.rawPrice420" clearable/></el-form-item>
        <el-form-item label="Q460" prop="section"><el-input v-model="tbPricePost.rawPrice460" clearable/></el-form-item>
        <el-form-item label="A572GR60" prop="section"><el-input v-model="tbPricePost.rawPriceGr50" clearable/></el-form-item>
        <el-form-item label="A572GR65" prop="section"><el-input v-model="tbPricePost.rawPriceGr65" clearable/></el-form-item>
        <el-form-item label="镀锌65" prop="section"><el-input v-model="tbPricePost.galvanizing65" clearable/></el-form-item>
        <el-form-item label="镀锌85" prop="section"><el-input v-model="tbPricePost.galvanizing85" clearable/></el-form-item>
        <el-form-item label="镀锌100" prop="section"><el-input v-model="tbPricePost.galvanizing100" clearable/></el-form-item>
        <el-form-item label="镀锌120" prop="section"><el-input v-model="tbPricePost.galvanizing120" clearable/></el-form-item>
        <el-form-item label="利用率" prop="section"><el-input v-model="tbPricePost.utilizationRate" clearable/></el-form-item>
        <el-form-item label="加工费" prop="section"><el-input v-model="tbPricePost.processingFee" clearable/></el-form-item>
        <el-form-item label="带法兰加工费" prop="section"><el-input v-model="tbPricePost.processingFeeFlange" clearable/></el-form-item>
        <el-form-item label="包装费" prop="section"><el-input v-model="tbPricePost.packagingFee" clearable/></el-form-item>
<!--        <el-form-item label="出口退税" prop="section"><el-input v-model="tbPricePost.exportTaxRebate" clearable/></el-form-item>-->
<!--        <el-form-item label="进口关税" prop="section"><el-input v-model="tbPricePost.importTariff" clearable/></el-form-item>-->
<!--        <el-form-item label="海运费" prop="section"><el-input v-model="tbPricePost.oceanFreight" clearable/></el-form-item>-->



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
import api from '@/api/eset/tbPricePost'

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
      tbPricePost: defaultForm,
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
      window.open(process.env.VUE_APP_BASE_API + '/eset/tbPricePost/export?token=' + getToken())
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
      this.tbPricePost = {}
      this.rules.name = [{ required: true, message: '请输入名称', trigger: 'blur' }]
    },
    //编辑
    edit(id) {
      this.dialogVisible = true
      this.rules.name = [{ required: true, message: '请输入名称', trigger: 'blur' }]
      api.getById(id).then(response => {
        this.$nextTick(function() {
          this.tbPricePost = response.data
          if (this.$refs.zdept) {
            this.$refs.zdept.reset_data(this.tbPricePost.deptName)
          }
          if (this.$refs.eltreeDept) {
            this.$refs.eltreeDept.setCheckedKeys(this.tbPricePost.deptIdList)
          }
        })
      })
    },
    //添加或更新
    saveOrUpdate() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          if (!this.tbPricePost.id) {
            this.save()
          } else {
            this.update()
          }
        }
      })
    },


    //添加
    save() {
      api.save(this.tbPricePost).then(response => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },
    //更新
    update() {
      api.updateById(this.tbPricePost).then(response => {
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
