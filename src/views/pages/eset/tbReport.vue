<template>
  <div id="app-container">
    <div class="data-talbe">
      <el-table
        :data="about_my_projects_selling"
        :row-key="getRowKeys"
        stripe
        border
        style="width: 100%;margin-top: 10px;"
      >
        <el-table-column prop="project_code" label="project code" width="130" sortable>
          <template slot-scope="scope">
            <el-button @click="projectDetails(scope.row.code)" type="text" size="small">{{ scope.row.code }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column sortable prop="name" label="project name"/>
        <el-table-column sortable prop="site" label="site"/>
        <el-table-column sortable prop="seller" label="seller"/>
        <el-table-column sortable prop="category" label="category"/>
        <el-table-column sortable prop="status" label="status"/>
        <el-table-column sortable prop="design_version" label="design version"/>
        <el-table-column sortable prop="technical_director" label="technical director"/>
        <el-table-column sortable prop="required_completion_time" label="required time"/>
        <el-table-column sortable prop="create_time" label="creat time"/>
        <el-table-column fixed="left" label="操作" width="240">
          <template slot-scope="scope">
            <el-button @click="showDialogFeedback(scope.row)" type="text" size="small" title="Please provide regular feedback on the progress of the project until there are results">feedback</el-button>
            <el-button @click="showDialogFinished(scope.row)" type="text" size="small" title="if has results, please provide feedback">completed</el-button>
<!--            <el-button @click="showDialogReject(scope.row)" type="text" size="small" title="方案退回修改">退回</el-button>-->
            <el-button @click="showDialogRedo(scope.row)" type="text" size="small" title="If you need the designer to make modifications or changes, please click here">update</el-button>
          </template>
        </el-table-column>
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
              <el-form-item label="sale manager">
                <span>{{ props.row.seller }}</span>
              </el-form-item>
              <el-form-item label="project status">
                <span>{{ props.row.status }}</span>
              </el-form-item>
              <el-form-item label="designer">
                <span>{{ props.row.designer }}</span>
              </el-form-item>
              <el-form-item label="geotechnical">
                <span>{{ props.row.geotechnical }}</span>
              </el-form-item>
              <el-form-item label="checker">
                <span>{{ props.row.checker }}</span>
              </el-form-item>
              <el-form-item label="technical director">
                <span>{{ props.row.technical_director }}</span>
              </el-form-item>
              <el-form-item label="Data Link">
              <span><a style="color:#20a0ff" :href="props.row.data_link" target="_blank"
              >{{ props.row.data_link }}</a></span>
              </el-form-item>
              <el-form-item label="required completion time">
                <span>{{ props.row.required_completion_time }}</span>
              </el-form-item>
              <el-form-item label="remark">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
              <el-form-item label="creat time"><span>{{ props.row.create_time }}</span></el-form-item>
              <el-form-item label="update time"><span>{{ props.row.update_time }}</span></el-form-item>
            </el-form>
          </template>
        </el-table-column>

      </el-table>
    </div>

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

    <!--确认项目完成对话框-->
    <div class="dialog-result">
      <el-dialog title="确认项目完成/Fill in project completion information" :visible.sync="finishedDialogVisible" width="40%"
                 :close-on-click-modal="false"
      >
        <el-form ref="dataForm" :model="finishedData" :rules="finished_rules" label-width="120px" size="small"
                 style="padding-right: 40px;"
        >
          <el-form-item label="Tender result" prop="result">
            <el-select v-model="finishedData.result" placeholder="please select" @change="resultChange">
              <el-option
                v-for="item in select_project_result"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="finishedData.result === '0'" label="the winner" prop="competitor">
            <el-input v-model="finishedData.competitor" placeholder="Please tell us the competitor who won the bid "/>
          </el-form-item>
          <el-form-item label="Say something" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="Please share your experience or knowledge gained in this project"
              maxlength="500"
              show-word-limit
              v-model="finishedData.remark"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="finishedDialogVisible = false" size="small" icon="el-icon-refresh-right"
            >取 消</el-button>
            <el-button type="primary" icon="el-icon-check" @click="makeSureFinished(theProject.code)" size="small"
            >确 定</el-button>
          </span>
      </el-dialog>
    </div>

    <!--退回到设计状态对话框-->
    <div class="dialog-reject">
      <el-dialog title="退回给设计师" :visible.sync="rejectDialogVisible" width="40%"
                 :close-on-click-modal="false"
      >
        <el-form ref="dataForm" :model="rejectData" :rules="reject_rules" label-width="120px" size="small"
                 style="padding-right: 40px;"
        >
          <el-form-item label="退回原因" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="place text the reason of reject"
              maxlength="500"
              show-word-limit
              v-model="rejectData.remark"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="rejectDialogVisible = false" size="small" icon="el-icon-refresh-right"
            >取 消</el-button>
            <el-button type="primary" icon="el-icon-check" @click="makeSureReject(theProject.code)" size="small"
            >确 定</el-button>
          </span>
      </el-dialog>
    </div>

    <!--项目进展反馈对话框-->
    <div class="dialog-feedback">
      <el-dialog title="项目进展反馈/Project progress feedback" :visible.sync="feedbackDialogVisible" width="40%"
                 :close-on-click-modal="false"
      >
        <el-form ref="dataForm" :model="feedbackData" :rules="feedback_rules" label-width="120px" size="small"
                 style="padding-right: 40px;"
        >
          <el-form-item label="项目进展情况" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="place text feedback context"
              maxlength="500"
              show-word-limit
              v-model="feedbackData.remark"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="feedbackDialogVisible = false" size="small" icon="el-icon-refresh-right"
            >取 消</el-button>
            <el-button type="primary" icon="el-icon-check" @click="makeSureFeedback(theProject.code)" size="small"
            >确 定</el-button>
          </span>
      </el-dialog>
    </div>

    <!--项目变更对话框-->
    <div class="dialog-redo">
      <el-dialog title="有变更，请设计师重做一版/Due to certain reasons, it is necessary to modify the design proposal" :visible.sync="redoDialogVisible" width="40%"
                 :close-on-click-modal="false"
      >
        <el-form ref="dataForm" :model="redoData" :rules="redo_rules" label-width="75px" size="small"
                 style="padding-right: 40px;"
        >
          <el-form-item label="变更原因  comment" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="place text the reason of redo"
              maxlength="500"
              show-word-limit
              v-model="redoData.remark"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="redoDialogVisible = false" size="small" icon="el-icon-refresh-right"
            >取 消</el-button>
            <el-button type="primary" icon="el-icon-check" @click="makeSureRedo(theProject.code)" size="small"
            >确 定</el-button>
          </span>
      </el-dialog>
    </div>

  </div>


</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import ProjectManagement from '@/views/pages/eset/trackers2/ProjectManagement.vue'

export default {
  components: { ProjectManagement },
  data() {
    return {
      theProject: {},  //当前正在操作的项目

      //drawer控件
      confirmMsg: '',
      showDetailProjectCode: '',//显示项目详情时的项目号
      drawer: false,
      direction: 'ltr',
      drawerContext: 'assignment', //当为projectList 时，打开项目详情

      listLoading: false, // 数据是否正在加载
      list: [], // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      activeName: 'first',
      about_all_my_projects: [],
      about_my_projects_designing: [],  //正在设计中的项目
      about_my_projects_selling: [],  //销售正在处理的项目
      about_my_projects_finished: [],  //已完成的项目

      //项目日志
      theProjectLog: {},  //当前正在操作的项目日志

      //对话框相关
      feedbackDialogVisible: false,
      finishedDialogVisible: false,
      rejectDialogVisible: false,
      redoDialogVisible: false,
      feedback_rules: {},  //对话框校验规则
      reject_rules: {
        remark : [
          { required: true, message: 'Please enter the reason or other conment', trigger: 'blur' },
          { min: 3, max: 500, message: 'Length of 10 to 500 characters', trigger: 'blur' }]
      },  //对话框校验规则
      finished_rules: {},  //对话框校验规则
      redo_rules: {},  //对话框校验规则
      feedbackData:{result:'',remark:''},
      finishedData:{result:'',remark:'',competitor:''},
      rejectData:{result:'',remark:''},
      redoData:{result:'',remark:''},

      select_project_result:[
        {label:'中标(win the bid)',value:'1'},
        {label:'未中标(loss the bid)',value:'0'},
      ]
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    resultChange(e){
      console.log(e);
      this.finished_rules = {}
      this.finished_rules.result = [
        { required: true, message: 'Please select the result', trigger: 'change' },
      ]
      if (e === '0') {
        this.finished_rules.competitor = [
          { required: true, message: 'Please enter the name of competitor', trigger: 'blur' },
          { min: 2, max: 100, message: 'Length of 2 to 100 characters', trigger: 'blur' }
        ]
        this.finished_rules.remark = [
          { required: true, message: 'Please enter the reason or other conment', trigger: 'blur' },
          { min: 3, max: 500, message: 'Length of 10 to 500 characters', trigger: 'blur' }
        ]
      }
    },
    showDialogFeedback(row) {
      this.theProject = row
      this.feedbackDialogVisible = true
    },
    showDialogFinished(row) {
      console.log(row)
      this.theProject = row
      this.finishedDialogVisible = true
    },

    showDialogReject(row) {
      this.theProject = row
      this.rejectDialogVisible = true
    },
    showDialogRedo(row) {
      this.theProject = row
      this.redoDialogVisible = true
    },

    makeSureFinished() {
      this.$refs.dataForm.validate(valid => {
        console.log(valid)
        if (valid) {
          const action = this.finishedData.result === '0'?'确认项目未中标':'确认项目中标'
          const content = this.finishedData.result === '0'?'中标友商:'+this.finishedData.competitor+';'+this.finishedData.remark:this.finishedData.remark
          this.theProjectLog = {
            project_code: this.theProject.code,
            action: action,
            action_remark: '项目: ' + this.theProject.name + ' 已完成',
            role: '销售经理',
            operator: this.name,
            to_person: '',
            to_id: '',
            content: content
          }
          this.fetchProjectFinished(this.theProject.code)  //将项目状态改为4(已完成),并将投标结果写入项目信息中
        }
      })

    },

    makeSureRedo(){
      this.$refs.dataForm.validate(valid => {
        console.log(valid)
        if (valid) {
          this.theProjectLog = {
            project_code: this.theProject.code,
            action: '项目变更',
            action_remark: '项目: ' + this.theProject.name + ' 方案变更',
            role: '销售经理',
            operator: this.name,
            to_person: this.theProject.designer,
            to_id: '',
            content: this.redoData.remark
          }
          this.fetchProjectRedo(this.theProject)  //将项目状态改为2(设计状态),将项目版本号加1，并将原因做个记录
        }
      })
    },

    makeSureReject() {
      this.$refs.dataForm.validate(valid => {
        console.log(valid)
        if (valid) {
          this.theProjectLog = {
            project_code: this.theProject.code,
            action: '方案退回修改',
            action_remark: '项目: ' + this.theProject.name + ' 退回给设计师修改',
            role: '销售经理',
            operator: this.name,
            to_person: this.theProject.designer,
            to_id: '',
            content: this.rejectData.remark
          }
          this.fetchProjectReject(this.theProject.code)  //将项目状态改为2(设计状态),并将原因作一个记录
        }
      })
    },

    makeSureFeedback(){
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.feedbackDialogVisible = false
          this.theProjectLog = {
            project_code: this.theProject.code,
            action: '项目进展反馈',
            action_remark: '项目: ' + this.theProject.name + ' 反馈',
            role: '销售经理',
            operator: this.name,
            to_person: '',
            to_id: '',
            content: this.feedbackData.remark
          }
          this.saveProjectLog(this.theProjectLog)  //添加日志
        }
      })
    },

    //添加项目日志
    saveProjectLog(logObj) {
      fetch(process.env.VUE_APP_BASE_API + '/api/saveProjectLog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/text',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify(logObj)
      })
        .then(response => {
          // 确保服务器响应为成功状态码
          if (response.ok) {
            // 获取响应体中的JSON数据
            this.approveTextarea = ''//将意见文本框内容清空

          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
    },

    handleClick(tab, event) {
      // console.log(tab, event)
    },
    getRowKeys(row) {
      return row.id
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
    //获取本人项目信息和编号
    fetchAboutMyProjectData() {
      this.listLoading = false
      fetch(process.env.VUE_APP_BASE_API + '/api/findAboutMyProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: this.name
      })
        .then(response => {
          // 确保服务器响应为成功状态码
          if (response.ok) {
            // 获取响应体中的JSON数据
            return response.json()
          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
        .then(r => {
          this.about_all_my_projects = r.data
          this.about_my_projects_selling = r.data.filter(p => p.status === '3')
          this.listLoading = true
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },
    //项目完成确认
    fetchProjectFinished(projectCode) {
      const subData = {
        code: projectCode,
        name: this.name,
        result: this.finishedData.result,
        result_remark: this.finishedData.result === '0'?'中标友商:'+this.finishedData.competitor+';'+this.finishedData.remark:this.finishedData.remark
      }

      this.$confirm('确定将项目状态改为‘已完成’吗？此操作不可撤回, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.finishedDialogVisible = false
        fetch(process.env.VUE_APP_BASE_API + '/api/setProjectFinished', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': getToken()// 添加Authorization字段，使用Bearer认证方式
          },
          body: JSON.stringify(subData)
        })
          .then(response => {
            // 确保服务器响应为成功状态码
            if (response.ok) {
              // 获取响应体中的JSON数据
              return response.json()
            } else {
              // 如果响应状态码不是2xx，抛出错误
              throw new Error('Something went wrong on server side.')
            }
          })
          .then(r=>{
            this.saveProjectLog(this.theProjectLog)  //添加日志
            this.fetchAboutMyProjectData()
          }).catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
      })

    },
    //项目退回
    fetchProjectReject(projectCode) {
      const subData = {
        code: projectCode,
        name: this.name,
      }
      this.$confirm('确定将本项目退回到设计部门进行修改吗？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.rejectDialogVisible = false
        fetch(process.env.VUE_APP_BASE_API + '/api/setProjectToDesign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': getToken()// 添加Authorization字段，使用Bearer认证方式
          },
          body: JSON.stringify(subData)
        })
          .then(response => {
            // 确保服务器响应为成功状态码
            if (response.ok) {
              // 获取响应体中的JSON数据
              return response.json()
            } else {
              // 如果响应状态码不是2xx，抛出错误
              throw new Error('Something went wrong on server side.')
            }
          })
          .then(r=>{
            this.saveProjectLog(this.theProjectLog)  //添加日志
            this.fetchAboutMyProjectData()
          }).catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
      })

    },

    //项目变更
    fetchProjectRedo(project) {
      const subData = {
        code: project.code,
        current_version:project.design_version,
        name: this.name,
      }
      this.$confirm('确定需要技术工程师再做一版吗？是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.redoDialogVisible = false
        fetch(process.env.VUE_APP_BASE_API + '/api/setProjectRedo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': getToken()// 添加Authorization字段，使用Bearer认证方式
          },
          body: JSON.stringify(subData)
        })
          .then(response => {
            // 确保服务器响应为成功状态码
            if (response.ok) {
              // 获取响应体中的JSON数据
              return response.json()
            } else {
              // 如果响应状态码不是2xx，抛出错误
              throw new Error('Something went wrong on server side.')
            }
          })
          .then(r=>{
            this.saveProjectLog(this.theProjectLog)  //添加日志
            this.fetchAboutMyProjectData()
          }).catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
      })

    }
  },
  mounted() {
    this.fetchAboutMyProjectData()
  }
}
</script>

<style scoped>
#app-container {
  margin-top: 10px;
  margin-left: 20px;
}

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

</style>
