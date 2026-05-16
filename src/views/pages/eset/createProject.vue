<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="100px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="project name">
              <el-input v-model="searchObj.name" placeholder="project name" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="project site">
              <el-input v-model="searchObj.site" placeholder="project site" clearable/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">search</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">reset</el-button>
          <span style="margin-left: 20px"><el-link type="primary" href="https://freefs.esetsolar.com/" target="_blank">click here go to cloud disk website / 跳转到云盘提资资料网站</el-link></span>
        </el-row>
      </el-form>

    </div>
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add"
                 :disabled="$hasBP('bnt.tbProject.add')  === false"
      >create a project
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
    >
      <el-table-column
        label="No."
        width="70"
        align="center"
      >
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="project_code" label="project code" width="130" sortable>
        <template slot-scope="scope">
          <el-button @click="projectDetails(scope.row.code)" type="text" size="small">{{scope.row.code}}</el-button>
        </template>
      </el-table-column>
      <el-table-column sortable prop="name" label="project name"/>
      <el-table-column sortable prop="site" label="site"/>
      <el-table-column sortable prop="status" label="status" :formatter="statusToStr"/>
<!--      <el-table-column sortable prop="seller" label="seller"/>-->
      <el-table-column sortable prop="category" label="category"/>
      <el-table-column sortable prop="capacity" label="capacity"/>
      <el-table-column sortable prop="client" label="client"/>
      <el-table-column sortable prop="technicalDirector" label="technical director"/>
      <el-table-column sortable prop="requiredCompletionTime" label="required time"/>
      <el-table-column sortable prop="createTime" label="create time"/>
      <el-table-column type="expand" label="...">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="project code">
              <span>{{ props.row.code }}</span>
            </el-form-item>
            <el-form-item label="project name">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="location">
              <span>{{ props.row.site }}</span>
            </el-form-item>
            <el-form-item label="designer">
              <span>{{ props.row.designer }}</span>
            </el-form-item>
            <el-form-item label="sale manager">
              <span>{{ props.row.seller }}</span>
            </el-form-item>
            <el-form-item label="technical director">
              <span>{{ props.row.technicalDirector }}</span>
            </el-form-item>
            <el-form-item label="capacity">
              <span>{{ props.row.capacity }}</span>
            </el-form-item>
            <el-form-item label="client">
              <span>{{ props.row.client }}</span>
            </el-form-item>
            <el-form-item label="Data Link">
              <span><a style="color:#20a0ff" :href="props.row.dataLink" target="_blank"
              >{{ props.row.dataLink }}</a></span>
            </el-form-item>
            <el-form-item label="required completion time">
              <span>{{ props.row.requiredCompletionTime }}</span>
            </el-form-item>
            <el-form-item label="remark">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
            <el-form-item label="creat time"><span>{{ props.row.createTime }}</span></el-form-item>
            <el-form-item label="update time"><span>{{ props.row.updateTime }}</span></el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="operate" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)"
                     :disabled="$hasBP('bnt.tbProject.update')  === false" title="修改"
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

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="560px"
      top="6vh"
      custom-class="create-project-dialog"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        class="create-project-form"
        :model="tbProject"
        :rules="rules"
        label-width="148px"
        size="small"
      >
        <div class="create-project-section">
          <div class="create-project-section__title">Basic</div>
          <el-form-item label="Project Name" prop="name">
            <el-input v-model="tbProject.name" placeholder="Please input the full name of project"/>
          </el-form-item>

          <!-- 销售经理字段 -->
          <input type="hidden" v-model="tbProject.seller"/>

          <el-form-item label="Project Site" prop="site">
            <el-select
              v-model="tbProject.site"
              class="create-project-field-full"
              filterable
              clearable
              placeholder="Search and select a country or region from the list (typing only filters options)"
            >
              <el-option
                v-for="site in allSiteSuggestStrings"
                :key="site"
                :label="site"
                :value="site"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Project Catagory" prop="category">
            <div class="create-project-category-row">
              <el-select
                v-model="theCategory"
                class="create-project-field-full create-project-category-select"
                multiple
                placeholder="Please select the category"
              >
                <el-option v-for="option in mydata.select_option.category" :key="option.value" :label="option.label" :value="option.value">
                </el-option>
              </el-select>
              <span class="create-project-hint">Multiple selections are allowed</span>
            </div>
          </el-form-item>
        </div>

        <div class="create-project-section">
          <div class="create-project-section__title">Project details</div>
          <el-form-item label="Client Name" prop="client">
            <el-input v-model="tbProject.client" placeholder="If confidentiality is required, you can fill in the abbreviation or alternative name of the customer's name"/>
          </el-form-item>

          <el-form-item label="Capacity(MWdc)" prop="capacity">
            <el-input v-model="tbProject.capacity" placeholder="Please fill in the DC power generation capacity in MW"/>
          </el-form-item>

          <el-form-item label="Required Time" prop="required_completion_time">
            <el-date-picker
              v-model="tbProject.requiredCompletionTime"
              class="create-project-field-full create-project-date"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </div>

        <div class="create-project-section">
          <div class="create-project-section__title">Links & notes</div>
          <el-form-item label="Data Link" prop="data_link">
            <el-input v-model="tbProject.dataLink" placeholder="Please input the data link"/>
            <div class="create-project-link-wrap">
              <el-link type="primary" href="https://freefs.esetsolar.com/" target="_blank">click here go to data web site /
                跳转到提资资料网站
              </el-link>
            </div>
          </el-form-item>

          <el-form-item label="Remark" prop="remark">
            <el-input type="textarea" v-model="tbProject.remark" class="create-project-remark" :rows="4"/>
            <div class="create-project-char-count">
              You have texted <span class="create-project-char-count__num">{{ charactersLength }}</span> characters / No more than <span class="create-project-char-count__limit">500</span> characters
            </div>
          </el-form-item>

          <el-form-item label="Update Reason" prop="data_link" v-if="dialogTitle.slice(0,6) === 'Update'">
            <el-input v-model="update_reason" maxlength="250" show-word-limit placeholder="Please input reason. For example, adding new information, changing requirements to time, etc"/>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="create-project-dialog__footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" size="small" icon="el-icon-check" @click="saveOrUpdate()">OK</el-button>
      </div>
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
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import api from '@/api/eset/tbProject'
import mydata from '@/api/eset/mydata'
import ProjectManagement from '@/views/pages/eset/trackers2/ProjectManagement.vue'

const defaultForm = {}
export default {
  components: { ProjectManagement },
  data() {
    return {
      //drawer控件
      theProject: {},  //保存正在操作的对象
      confirmMsg: '',
      showDetailProjectCode:'',//显示项目详情时的项目号
      drawer: false,
      direction: 'ltr',
      drawerContext:'assignment', //当为projectList 时，打开项目详情

      listLoading: true, // 数据是否正在加载
      list: [], // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象
      dialogVisible: false,
      tbProject: defaultForm,
      saveBtnDisabled: false,
      theCategory:[],//支架类别多选框数组
      selectValue: [], //复选框选择内容封装数组
      dialogTitle:'',
      update_reason:'',
      optionsMap: mydata.select_option.optionsMap,
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      },

    }
  },

  computed: {
    mydata() {
      return mydata
    },
    ...mapGetters([
      'name'
    ]),
    charactersLength() {
      let a = 0
      if (this.tbProject.remark === undefined || this.tbProject.remark === null) {
        a = 0
      } else {
        a = this.tbProject.remark.length
      }
      return a
    },
    /** 所有分区下的国家/地区选项（去重），供可检索下拉 */
    allSiteSuggestStrings() {
      const out = []
      const om = this.optionsMap
      if (!om) return []
      Object.keys(om).forEach((key) => {
        const arr = om[key]
        if (Array.isArray(arr) && arr.length) {
          arr.forEach((item) => out.push(item))
        }
      })
      return [...new Set(out)].sort((a, b) => a.localeCompare(b))
    },
  },
  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    this.fetchData()
  },

  methods: {
    projectDetails(projectCode){
      this.drawerContext = 'projectList'
      this.direction= 'rtl'
      this.drawer = true
      this.showDetailProjectCode = projectCode
    },
    handleClose(done) {
      done()
    },
    handleChange(val) {

    },
    //状态数字转文字
    statusToStr(row, column, cellValue, index) {
      if (cellValue === '-1'){
        return 'Reject'
      } else if (cellValue === '0'){
        return 'Applying for create'
      } else if (cellValue === '1') {
        return 'In design'
      } else if (cellValue === '2') {
        return 'In design'
      } else if (cellValue === '3') {
        return 'Sales Processing'
      } else if (cellValue === '4') {
        return 'Closed'
      } else {
        return cellValue
      }
    },

    //发送通知信息
    sendNotification(toObj){
      fetch(process.env.VUE_APP_BASE_API + '/api/sendNotification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify(
          {
            "fullName":toObj.fullName,
            "phoneNumber":toObj.phoneNumber,
            "email":toObj.email,
            "dingTalk":toObj.dingTalk
          }
        )
      })
    },

    //当项目创建时，在tb_project_log表中写一个记录
    addProjectLogCreate(){
      fetch(process.env.VUE_APP_BASE_API + '/api/addProjectLogCreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify(
          {
            "fullName":this.name
          }
        )
      })
    },


    //在当项目信息修改时，tb_project_log表中写一个记录
    addProjectLogUpdate(id){
      fetch(process.env.VUE_APP_BASE_API + '/api/addProjectLogUpdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify(
          {
            "id":id,
            "fullName":this.name,
            "updateReason":this.update_reason.replaceAll("\"","“")
          }
        )
      })
    },

    //根据项目所在区选择技术总监
    getTechnicalDirector(site, categroy) {
      const s = this.optionsMap
      let europe = [...s.western_europe, ...s.nordic, ...s.central_europe, ...s.eastern_europe, ...s.southern_europe, ...s.europe_other]
      let latin_america = [...s.central_america, ...s.south_america, ...s.caribbean_region]
      //同时含有跟踪和多种时
      if(categroy.includes('Tracker') && ['Fixed','Car', 'Tensile', 'Other'].some(item=>categroy.includes(item))){
        return { fullName:'万龙波', phoneNumber:'18601419370', email:'z2k6srz@dingtalk.com', dingTalk:'z2k6srz'}
      }
      if (categroy.includes('Tracker')) {
        if ([...europe, ...latin_america].includes(site)) {
          return { fullName:'王鹏飞', phoneNumber:'18516790610', email:'frank.wang@esetsolar.com', dingTalk:'5vc-01gqg38vt'}
        } else {
          return { fullName:'万龙波', phoneNumber:'18601419370', email:'z2k6srz@dingtalk.com', dingTalk:'z2k6srz'}
        }
      } else {
        return { fullName:'马骏', phoneNumber:'18552015127', email:'majun5127@dingtalk.com', dingTalk:'majun5127'}
      }
    },

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
      this.searchObj.seller = this.name
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

    //弹出添加表单
    add(row) {
      this.dialogTitle = 'Create New Project'
      this.dialogVisible = true
      if (this.$refs.zdept) {
        this.$refs.zdept.reset_data()
      }
      this.tbProject = {
        seller: this.name // 默认值
      }
      this.rules.name = [{ required: true, message: '请输入名称', trigger: 'blur' }]
      this.rules.site = [{ required: true, message: '请填写或选择项目所在地', trigger: 'change' }]
      this.rules.category = [{ required: true, message: '请选择项目类别', trigger: 'blur' }]
      this.rules.capacity = [{ required: true, message: '请输入项目容量', trigger: 'blur' }]
      this.rules.client = [{ required: true, message: '请输入客户名称', trigger: 'blur' }]
    },

    //编辑
    edit(row) {
      this.dialogTitle = 'Update New Project'
      this.dialogVisible = true
      if(this.theCategory.indexOf(',')){
        this.theCategory = row.category.split(',')
      } else {
        this.theCategory = [row.category]
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
      this.tbProject.category = this.theCategory.join(',')
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          if (!this.tbProject.id) {
            const technicalDirector = this.getTechnicalDirector(this.tbProject.site, this.tbProject.category)
            this.tbProject.technicalDirector = technicalDirector.fullName
            this.save(technicalDirector)
          } else {
            this.update()
          }
        }
      })
      this.theCategory = []
    },

    //添加
    //toObj  发送短信息的对象
    save(toObj) {
      this.dialogVisible = false
      api.save(this.tbProject).then(response => {
        this.$message.success('操作成功')
        this.fetchData(this.page)
        this.addProjectLogCreate()  //在项目日志中写一条记录
        this.sendNotification(toObj)  //发出信息通知
      })
    },
    //更新
    update() {
      this.dialogVisible = false
      api.updateById(this.tbProject).then(response => {
        this.$message.success(response.message || '操作成功')
        this.addProjectLogUpdate(this.tbProject.id)  //在项目日志中写一条记录
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

.radio-item {
  margin-bottom: 10px; /* 增大下间距 */
  margin-top: 10px; /* 增大上间距 */
}

.checkbox-item {
  margin-bottom: 10px; /* 增大下间距 */
  margin-top: 10px; /* 增大上间距 */
}

.create-project-section {
  padding-bottom: 4px;
  margin-bottom: 18px;
  border-bottom: 1px solid #ebeef5;
}

.create-project-section:last-of-type {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.create-project-section__title {
  margin: 0 0 14px;
  padding-left: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #606266;
  letter-spacing: 0.02em;
  border-left: 3px solid #409eff;
  line-height: 1.3;
}

.create-project-form .el-form-item {
  margin-bottom: 18px;
}

.create-project-form .el-form-item:last-child {
  margin-bottom: 0;
}

.create-project-field-full {
  width: 100%;
}

.create-project-category-row {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px 16px;
}

.create-project-category-select {
  flex: 1;
  min-width: 220px;
}

.create-project-hint {
  flex-shrink: 0;
  align-self: center;
  font-size: 12px;
  color: #67c23a;
}

.create-project-link-wrap {
  margin-top: 8px;
}

.create-project-char-count {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.create-project-char-count__num {
  color: #e6a23c;
  font-weight: 600;
}

.create-project-char-count__limit {
  color: #f56c6c;
  font-weight: 600;
}

.create-project-remark >>> .el-textarea__inner {
  min-height: 96px;
  line-height: 1.5;
  resize: vertical;
}
</style>

<style>
/* Dialog is often mounted on body; keep class prefix unique */
.create-project-dialog.el-dialog {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(15, 37, 64, 0.14);
}

.create-project-dialog .el-dialog__header {
  padding: 18px 24px 16px;
  border-bottom: 1px solid #ebeef5;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 55%);
}

.create-project-dialog .el-dialog__title {
  font-size: 17px;
  font-weight: 600;
  color: #303133;
  letter-spacing: 0.02em;
}

.create-project-dialog .el-dialog__body {
  padding: 20px 24px 8px;
  max-height: calc(84vh - 180px);
  overflow-y: auto;
}

.create-project-dialog .el-dialog__body::-webkit-scrollbar {
  width: 6px;
}

.create-project-dialog .el-dialog__body::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.create-project-dialog__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 4px 4px;
}

.create-project-dialog .el-dialog__footer {
  padding: 14px 24px 18px;
  border-top: 1px solid #ebeef5;
  background: #fafbfc;
  box-sizing: border-box;
}
</style>



