<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="名称">
              <el-input v-model="searchObj.name" placeholder="名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目地">
              <el-input v-model="searchObj.site" placeholder="项目所在地" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目状态">
              <el-select v-model="searchObj.status" placeholder="请选择项目状态" clearable>
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
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
                 :disabled="$hasBP('bnt.tbProject.add')  === false"
      >添 加
      </el-button>
      <el-button class="btn-add" size="mini" @click="batchRemove()"
                 :disabled="$hasBP('bnt.tbProject.remove')  === false"
      >
        批量删除
      </el-button>
      <el-button style="margin-left:8px" size="mini" :disabled="$hasBP('bnt.tbProject.list')  === false" type="primary"
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
      <el-table-column prop="project_code" label="项目号" width="120" sortable>
        <template slot-scope="scope">
          <el-button @click="projectDetails(scope.row.code)" type="text" size="small">{{ scope.row.code }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column sortable prop="name" label="名称"/>
      <el-table-column sortable prop="site" label="项目所在地" width="160px"/>
      <el-table-column sortable prop="designer" label="结构工程师" width="120px"/>
      <el-table-column sortable prop="geotechnical" label="岩土工程师" width="120px"/>
      <el-table-column sortable prop="checker" label="校对人" width="120px"/>
      <el-table-column sortable prop="seller" label="销售经理" width="120px"/>
      <el-table-column sortable prop="technicalDirector" label="技术负责人" width="120px"/>
      <el-table-column sortable prop="category" label="类别"/>
      <el-table-column sortable prop="status" label="状态" width="100px" :formatter="statusToStr"/>
      <el-table-column sortable prop="createTime" label="创建时间"/>
      <el-table-column sortable prop="requiredCompletionTime" label="要求完成时间"/>
      <el-table-column type="expand" label="...">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="项目编号">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="名称">
              <span>{{ props.row.code }}</span>
            </el-form-item>
            <el-form-item label="项目所在地">
              <span>{{ props.row.site }}</span>
            </el-form-item>
            <el-form-item label="结构工程师">
              <span>{{ props.row.designer }}</span>
            </el-form-item>
            <el-form-item label="岩土工程师">
              <span>{{ props.row.geotechnical }}</span>
            </el-form-item>
            <el-form-item label="销售经理">
              <span>{{ props.row.seller }}</span>
            </el-form-item>
            <el-form-item label="技术负责人">
              <span>{{ props.row.technicalDirector }}</span>
            </el-form-item>
            <el-form-item label="资料链接">
              <span><a style="color:#20a0ff" :href="props.row.dataLink" target="_blank"
              >{{ props.row.dataLink }}</a></span>
            </el-form-item>
            <el-form-item label="要求完成时间">
              <span>{{ props.row.requiredCompletionTime }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
            <el-form-item label="创建时间"><span>{{ props.row.createTime }}</span></el-form-item>
            <el-form-item label="修改时间"><span>{{ props.row.updateTime }}</span></el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="120px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)"
                     :disabled="$hasBP('bnt.tbProject.update')  === false" title="修改"
          />
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)"
                     :disabled="$hasBP('bnt.tbProject.remove')  === false" title="删除"
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
      :page-sizes="[5, 10, 50, 100,500]"
      layout="total,sizes, prev, pager, next, jumper"
      @current-change="fetchData"
    />

    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="tbProject" :rules="rules" label-width="100px" size="small"
               style="padding-right: 40px;"
      >
        <el-form-item label="项目编号" prop="code">
          <el-input v-model="tbProject.code" disabled placeholder="系统自动生成"/>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="tbProject.name"/>
        </el-form-item>
        <el-form-item label="项目所在地" prop="site">
          <el-input v-model="tbProject.site"/>
        </el-form-item>
        <el-form-item label="结构工程师" prop="designer">
          <el-row :gutter="0">
            <el-select v-model="theEditDesigner" multiple placeholder="请选择结构设计师" filterable size="mini">
              <el-option
                v-for="item in mydata.select_option.designer"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-row>
        </el-form-item>
        <el-form-item label="岩土工程师" prop="geotechnical">
          <el-row :gutter="0">
            <el-select v-model="theEditGeotechnical" multiple placeholder="请选择岩土工程师" filterable size="mini">
              <el-option
                v-for="item in mydata.select_option.designer"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-row>
        </el-form-item>
        <el-form-item label="销售经理" prop="seller">
          <el-input v-model="tbProject.seller"/>
        </el-form-item>
        <el-form-item label="技术负责人" prop="technical_director">
          <el-input v-model="tbProject.technicalDirector"/>
        </el-form-item>
        <el-form-item label="资料链接" prop="data_link">
          <el-input v-model="tbProject.dataLink"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-drawer
      title="项目信息"
      :visible.sync="drawer"
      :direction="direction"
      :destroy-on-close="true"
      size="50%"
      :before-close="handleClose"
    >
      <div v-if="drawerContext === 'projectList'">
        <P>{{ confirmMsg }}</P>
        <ProjectManagement :project_code="showDetailProjectCode"></ProjectManagement>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import api from '@/api/eset/tbProject'
import mydata from '@/api/eset/mydata'
import ProjectManagement from '@/views/pages/eset/trackers2/ProjectManagement.vue'

const defaultForm = {}
export default {
  components: { ProjectManagement },
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: [], // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 50, // 每页记录数
      searchObj: {}, // 查询表单对象
      dialogVisible: false,
      tbProject: defaultForm,
      saveBtnDisabled: false,
      selectValue: [], //复选框选择内容封装数组
      siteCategory: '',
      siteOptions: [
        { label: '========中东和非洲middle_east_africa========', value: 'middle_east_africa' },
        { label: '南部非洲区域south_africa', value: 'south_africa' },
        { label: '中东和北非middle_east_and_north_africa', value: 'middle_east_and_north_africa' },
        { label: '====亚太====', value: 'asia_pacific' },
        { label: '东亚', value: 'east_asia' },
        { label: '东南亚', value: 'southeast_asia' },
        { label: '中亚', value: 'central_asia' },
        { label: '南亚', value: 'south_asia' },
        { label: '西亚', value: 'west_asia' },
        { label: '亚太其他', value: 'asia_pacific_other' },
        { label: '====欧洲====', value: 'europe' },
        { label: '西欧', value: 'western_europe' },
        { label: '北欧', value: 'nordic' },
        { label: '中欧', value: 'central_europe' },
        { label: '东欧', value: 'eastern_europe' },
        { label: '南欧', value: 'southern_europe' },
        { label: '欧洲其他', value: 'europe_other' },
        { label: '====拉美====', value: 'latin_america' },
        { label: '中美洲', value: 'central_america' },
        { label: '南美洲', value: 'south_america' },
        { label: '加勒比地区', value: 'caribbean_region' }
      ],
      statusOptions: [
        { label: '待指派设计师', value: '1' },
        { label: '正在设计中', value: '2' },
        { label: '销售正在处理中', value: '3' },
        { label: '已完成', value: '4' }
      ],
      theEditDesigner: [],
      theEditGeotechnical: [],
      rules: {
        name:
          [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ]
      },
      //drawer控件
      theProject: {},  //保存正在操作的对象
      confirmMsg: '',
      showDetailProjectCode: '',//显示项目详情时的项目号
      drawer: false,
      direction: 'ltr',
      drawerContext: 'assignment' //当为projectList 时，打开项目详情
    }
  },
  computed: {
    mydata() {
      return mydata
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
      window.open(process.env.VUE_APP_BASE_API + '/eset/tbProject/export?token=' + getToken())
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
      this.tbProject = {}
      this.rules.name = [{ required: true, message: '请输入名称', trigger: 'blur' }]
    },
    //编辑
    edit(row) {
      // this.theEditDesigner = [row.designer]
      // this.theEditGeotechnical = [row.geotechnical]
      this.tbProject = row
      this.dialogVisible = true
      //将可多选框变为数组
      if (this.theEditDesigner.indexOf(',')) {
        this.theEditDesigner = row.designer.split(',')
      } else {
        this.theEditDesigner = [row.designer]
      }
      if (this.theEditGeotechnical.indexOf(',')) {
        this.theEditGeotechnical = row.geotechnical.split(',')
      } else {
        this.theEditGeotechnical = [row.geotechnical]
      }
      this.rules.name = [{ required: true, message: '请输入名称', trigger: 'blur' }]
      api.getById(row.id).then(response => {
        this.$nextTick(function() {
          this.tbProject = response.data
          if (this.$refs.zdept) {
            this.$refs.zdept.reset_data(this.tbProject.deptName)
          }
          if (this.$refs.eltreeDept) {
            this.$refs.eltreeDept.setCheckedKeys(this.tbProject.deptIdList)
          }
        })
      })
    },
    //添加或更新
    saveOrUpdate() {
      this.tbProject.designer = this.theEditDesigner.join(',')
      this.tbProject.geotechnical = this.theEditGeotechnical.join(',')
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          if (!this.tbProject.id) {
            this.save()
          } else {
            this.update()
          }
        }
      })
    },
    //添加
    save() {
      api.save(this.tbProject).then(response => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },
    //更新
    update() {
      api.updateById(this.tbProject).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    projectDetails(projectCode) {
      this.drawerContext = 'projectList'
      this.direction = 'rtl'
      this.drawer = true
      this.showDetailProjectCode = projectCode
    },
    handleClose(done) {
      done()
    },
    //状态数字转文字
    statusToStr(row, column, cellValue, index) {
      if (cellValue === '0'){
        return '未立项'
      }else if (cellValue === '1') {
        return '未指派'
      } else if (cellValue === '2') {
        return '已指派'
      } else if (cellValue === '3') {
        return '销售处理'
      } else if (cellValue === '4') {
        return '已完成'
      } else {
        return cellValue
      }
    }

  },
  filters: {}
}
</script>
<style scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 120px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.radio-item {
  margin-bottom: 10px; /* 增大下间距 */
  margin-top: 10px; /* 增大上间距 */
}

.checkbox-item {
  margin-bottom: 10px; /* 增大下间距 */
  margin-top: 10px; /* 增大上间距 */
}
</style>
