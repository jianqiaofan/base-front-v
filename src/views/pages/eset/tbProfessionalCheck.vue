<template>
  <div id="app-container">

    <div class="approve">
      <div class="container">
        <div>
          <el-table :data="myApprovePlanList" border style="width: 100%">
            <el-table-column prop="project_code" label="项目编号" width="120" sortable>
              <template slot-scope="scope">
                <el-button @click="projectDetails(scope.row.project_code)" type="text" size="small">
                  {{ scope.row.project_code }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="plan_description" label="方案名称" width="300" sortable></el-table-column>
            <el-table-column prop="category" label="结构类型" width="140"></el-table-column>
            <el-table-column prop="designer" label="结构工程师" width="140">
            </el-table-column>
            <el-table-column prop="stru_result_data_link" label="待校核资料(上部结构)" width="220"
                             :formatter="formatDataLink"
            >
              <template slot-scope="scope">
                <a style="color:#20a0ff" :href="scope.row.stru_result_data_link" target="_blank"
                >{{ scope.row.stru_result_data_link|filterLink(30) }}</a>
              </template>
            </el-table-column>
            <el-table-column label="工具" width="150">
              <template slot-scope="scope">
                <button v-if="scope.row.category==='1P Tracker' || scope.row.category==='2P Tracker'"
                        @click="showTrackerBom(scope.row.plan_code)"
                >跟踪支架BOM
                </button>
                <button v-if="scope.row.category !=='1P Tracker' && scope.row.category !=='2P Tracker'"
                        @click="showOtherBom(scope.row.plan_code)"
                >导入BOM表
                </button>
              </template>
            </el-table-column>
            <el-table-column prop="design_version" label="变更号" width="80"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>


    <div class="drawer">
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

    <div class="drawer">
      <el-drawer
        title="Tracker BOM 清单"
        :visible.sync="drawerTrackerBomVisible"
        direction="rtl"
        :destroy-on-close="true"
        size="100%"
        :before-close="handleCloseTrackerBom"
      >
        <TrackerIndex :planCode="thePlanCode" :saveable="false"></TrackerIndex>
      </el-drawer>
    </div>

    <div class="drawer">
      <el-drawer
        title="支架 BOM 清单"
        :visible.sync="drawerOtherBomVisible"
        direction="rtl"
        :destroy-on-close="true"
        size="100%"
        :before-close="handleCloseExcelBom"
      >
        <tbImportBom :planCode="thePlanCode" :saveable="false" :modifiable="false" :bomindex="1"></tbImportBom>
      </el-drawer>
    </div>


    <!--校核审批对话框-->
    <div class="dialog-approve">
      <el-dialog :title="approveDialogTitle" :visible.sync="approveDialogVisible" width="40%"
                 :close-on-click-modal="false"
      >
        <div>
          是否需要报价部门：
          <el-select v-model="isNeedPricing" placeholder="请选择">
            <el-option label="请选择" value="0"></el-option>
            <el-option label="需要价格部门确认材料价格" value="1"></el-option>
            <el-option label="直接提交到市场部门" value="2"></el-option>
          </el-select>
          <span style="color: red"> * 必填</span>
        </div>
        <p>原因或备注</p>
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          maxlength="500"
          show-word-limit
          v-model="approveTextarea"
        >
        </el-input>

        <span slot="footer" class="dialog-footer">
            <el-button @click="approveDialogVisible = false" size="small" icon="el-icon-refresh-right"
            >取 消</el-button>
            <el-button type="primary" icon="el-icon-check" @click="makeSureApprove()" size="small"
            >确 定</el-button>
          </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import mydata from '@/api/eset/mydata'
import ProjectManagement from '@/views/pages/eset/trackers2/ProjectManagement.vue'
import apiPlan from '@/api/eset/tbProjectPlan'
import echarts from 'echarts/lib/echarts'
import tbImportBom from '@/views/pages/eset/tbImportBom.vue'
import TrackerIndex from '@/views/pages/eset/trackers2/TrackerIndex.vue'

export default {
  components: { tbImportBom, ProjectManagement,TrackerIndex },
  data() {
    return {
      thePlan: {},  //当前正在操作的方案
      thePlanCode: '',//正在操作的方案号

      theProject: {},  //保存正在操作的对象
      confirmMsg: '',
      sayToDesigners: '',  //指派设计师的的补充说明

      showDetailProjectCode: '',//显示项目详情时的项目号
      drawer: false,
      direction: 'ltr',
      drawerContext: 'assignment', //当为projectList 时，打开项目详情

      activeNames: ['1'],
      selectedDesigner: '',

      showPlanApproveItem: false,  //审批方案显示

      isNeedPricing: '请选择',  //是否需要报价部门填写价格

      assignmentProjectList: [],  //需要我指派任务的项目
      myApprovePlanList: [],  //需要我审批的方案
      myApproveProjectList: [],//需要我审批的方案的项目

      //对话框相关
      approveTextarea: '',
      approveDialogTitle: '',//方案对话框标题
      approveDialogVisible: false,//方案对话框可视

      allTechnicalEngineers: [], //所有技术人员名单
      designer_option: [],  //designer选项卡

      drawerTrackerBomVisible: false,
      drawerOtherBomVisible: false

    }
  },
  computed: {
    mydata() {
      return mydata
    },
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    //跟踪支架，打开BOM计算工具
    showTrackerBom(planCode) {
      this.thePlanCode = planCode
      //以抽屉方式打开跟踪支架报价工具，后面再完成
      this.drawerTrackerBomVisible = true
    },
    //其它类型支架，导入excel
    showOtherBom(planCode) {
      this.thePlanCode = planCode
      //以抽屉方式打开跟踪支架报价工具，后面再完成
      this.drawerOtherBomVisible = true
    },

    projectDetails(projectCode) {
      this.drawerContext = 'projectList'
      this.direction = 'rtl'
      this.drawer = true
      this.showDetailProjectCode = projectCode
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    handleCloseTrackerBom(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    handleCloseExcelBom(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    handleChange(val) {
      console.log('###', val)
    },
    fetchApprovePlanData() {
      fetch(process.env.VUE_APP_BASE_API + '/api/getPlanByPlanCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify({
          'plan_code': '1775011494309',
          'myName': this.name
        })
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
        .then(r => {
          this.myApprovePlanList = r.data
          console.log(this.myApprovePlanList)
        })
    },

    //技术总监负责的未完工的所有项目
    fetchDirectorProjectData() {
      fetch(process.env.VUE_APP_BASE_API + '/api/getDirectorApproveProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: this.name
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
        .then(r => {
          this.myApproveProjectList = r.data
        })
    },

    //在tb_project_log表中写一个记录
    addProjectLogAssignmentStructure(id) {
      fetch(process.env.VUE_APP_BASE_API + '/api/addProjectLogAssignmentStructure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify(
          {
            'id': id,
            'fullName': this.name,
            'content': this.sayToDesigners
          }
        )
      })
    },

    //添加或更新
    formatDataLink(row, column, cellValue, index) {
      let link = ''
      if (cellValue !== undefined && cellValue !== null && cellValue.slice(0, 4) === 'http') {
        link = cellValue.slice(0, 15) + '...'
      }
      return link
    },
    formatCheckStatus(row, column, cellValue, index) {
      if (cellValue !== null && cellValue !== undefined) {
        if (cellValue === '0') {
          return '校核驳回'
        }
        if (cellValue === '1') {
          return '正在校对'
        }
        if (cellValue === '2') {
          return '校核通过'
        }
      } else {
        return '未提交校核'
      }
    },

    //技术总监审批通过
    showDialogDirectorApprove(row) {
      this.theProject = this.myApproveProjectList.find((e) => e.code === row.project_code)
      this.thePlan = this.coverPlan(row)

      this.approveDialogTitle = '设计方案通过-' + this.theProject.name + '-' + row.plan_description
      this.theProjectLog = {
        project_code: row.project_code,
        action: '设计方案审批通过',
        action_remark: '方案名称:' + row.plan_description,
        role: '审批人',
        operator: this.name,
        to_person: this.theProject.seller + ',' + row.designer,
        to_id: row.id,
        content: ''
      }
      this.approveDialogVisible = true  //显示审批对话框
    },
    //技术总监审批驳回
    showDialogDirectorReject(row) {
      this.theProject = this.myApproveProjectList.find((e) => e.code === row.project_code)
      this.thePlan = this.coverPlan(row)
      this.thePlan.planStatus = '0'  //将检查状态改为0-退回到设计状态
      this.approveDialogTitle = '设计方案驳回-' + this.theProject.name + '-' + row.plan_description
      this.theProjectLog = {
        project_code: row.project_code,
        action: '设计方案审批驳回',
        action_remark: '方案名称:' + row.plan_description,
        role: '审批人',
        operator: this.name,
        to_person: row.designer,
        to_id: row.id,
        content: ''
      }
      this.approveDialogVisible = true  //显示审批对话框
    },

    //审批通过或驳回
    makeSureApprove() {
      if (this.isNeedPricing === '1' || this.isNeedPricing === '2') {
        let msg = ''
        this.theProjectLog.content = this.approveTextarea  //写入通过或驳回的意见
        if (this.isNeedPricing === '1') {
          msg = '此操作将提交给价格人员进行价格填报或报价确认，是否继续'
          this.theProjectLog.action = '价格申请'
          this.theProjectLog.to_person = '王柯,卜焕坡'
          this.thePlan.planStatus = '1a'  //将方案状态改为1a-审批通过，跳转到价格部门填写价格
        } else if (this.isNeedPricing === '2') {
          this.thePlan.planStatus = '2'  //将方案状态改为2-审批通过，销售总监和销售经理都能看到了
          msg = '此操作将本方案提交给销售经理进行投标，是否继续'
        }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //修改方案表中的相关状态(this.thePlan中已含有变化)
          apiPlan.updateById(this.thePlan).then(response => {
            this.$message.success(response.message || '操作成功')
            //如果是审批通过，还要将项目表中状态改为设计已完成状态
            if (this.thePlan.planStatus === '2') {
              this.updataProjectStatus(this.thePlan.projectCode)
            }
            this.saveProjectLog(this.theProjectLog)//加一条项目日志
            this.fetchApprovePlanData()
          }).catch((reason) => {
            alert('错误原因：' + reason)
          })
          this.approveDialogVisible = false
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消提交'
          })
        })
      } else {
        this.$alert('必须选择是否需要价格部门填写材料价格', '提示信息缺失', {
          confirmButtonText: '确定',
          callback: action => {
            return
          }
        })
        return
      }

    },
    //将项目表中状态改为设计完成状态
    updataProjectStatus(project_code) {
      fetch(process.env.VUE_APP_BASE_API + '/api/updateProjectStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/text',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify({
          project_code: project_code,
          status: 3
        })
      })
        .then(() => {
          //后面再处理

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

    coverPlan(obj) {
      let r = {
        id: obj.id,
        planCode: obj.plan_code,
        projectCode: obj.project_code,
        planDescription: obj.plan_description,
        category: obj.category,
        planStatus: obj.plan_status,
        designer: obj.designer,
        struResultDataLink: obj.stru_result_data_link,
        struChecker: obj.stru_checker,
        struCheckStatus: obj.stru_check_status,
        trackerInfoNum: obj.tracker_info_num,
        adjustPriceMsg: obj.adjust_price_msg,
        geotechnical: obj.geotechnical,
        dataLinkToGeotechnical: obj.data_link_to_geotechnical,
        geoRequiredCompletionTime: obj.geo_required_completion_time,
        geoResultDataLink: obj.geo_result_data_link,
        geoChecker: obj.geo_checker,
        geoCheckStatus: obj.geo_check_status
      }
      return r
    }

  },
  filters: {
    filterLink(str, n) {
      if (typeof str !== 'string') {
        return undefined
      } else {
        if (str.trim().slice(0, 4) === 'http') {
          return str.slice(0, n)
        } else {
          return undefined
        }
      }
    },

    filterGeotechnical(value) {
      if (typeof value !== 'string') {
        return '点击指定岩土'
      } else {
        if (value.length < 1) {
          return '点击指定岩土'
        } else {
          return value
        }
      }
    },
    filterChecker(value) {
      if (typeof value !== 'string') {
        return '点击提交校对'
      } else {
        if (value.length < 1) {
          return '点击提交校对'
        } else {
          return value
        }
      }
    },
  },

  mounted() {
    this.fetchApprovePlanData()  //找到要审批的方案列表
    this.fetchDirectorProjectData() //找到技术总监负责的项目列表（未完工的项目）
  }

}
</script>

<style scoped>
#app-container {
  padding: 10px;
}

.badges {
  display: flex;
}

.badges div {
  margin: 10px;
}

h2:hover {
  cursor: pointer;
}

::v-deep .el-collapse-item__header {
  background-color: #f5f5f5;
  color: #333;
  font-size: 16px;
}

.link-item {
  font-size: 12px;
  color: #FFFFFF;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #409EFF;
}

</style>
