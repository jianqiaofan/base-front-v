<template>
  <div id="app-container">
    <div class="badges">
      <div class="div-badge" @click="showProjectAssignmentItem = !showProjectAssignmentItem">
        <el-badge :value="assignmentProjectList.length" class="item"
                  :type="assignmentProjectList.length>0?'danger':'primary'"
        >
          <el-button size="small">项目指派</el-button>
        </el-badge>
      </div>
      <div class="div-badge" @click="showPlanApproveItem = !showPlanApproveItem">
        <el-badge :value="myApprovePlanList.length" class="item"
                  :type="myApprovePlanList.length>0?'danger':'primary'"
        >
          <el-button size="small">方案审批</el-button>
        </el-badge>
      </div>
      <div class="div-badge" @click="showChartDiv">
        <el-badge :value="1" class="item" type="primary">
          <el-button size="small">繁忙程度表</el-button>
        </el-badge>
      </div>
    </div>

    <div class="assignment">
      <h2 @click="showProjectAssignmentItem = !showProjectAssignmentItem">任务指派</h2>
      <div class="container" style="overflow-x:auto" v-show="showProjectAssignmentItem">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item v-for="p in assignmentProjectList" :title="p.code + ` `+ p.name" :name="p.index" :key="p.id">
            <div>项目编号：
              <el-button @click="projectDetails(p.code)" type="text" size="small">{{ p.code }}</el-button>
            </div>
            <div>所在地：{{ p.site }}</div>
            <div>客户名：{{ p.client }}</div>
            <div>投标容量：{{ p.capacity }}MWdc</div>
            <div>支架类别：{{ p.category }}</div>
            <div>设计师：{{ p.designer }}</div>
            <div>销售经理：{{ p.seller }}</div>
            <div>要求完成时间：{{ p.required_completion_time }}</div>
            <div>资料链接：<a style="color:#20a0ff" :href="p.data_link" target="_blank"
            >{{ p.data_link|filterLink(60) }}</a></div>
            <div>创建时间：{{ p.create_time }}</div>
            <!--          <div>id：{{ p.id }}</div>-->
            <div style="padding: 10px 0">
              <el-select v-model="p.designer" multiple placeholder="请选择设计师" filterable size="mini">
                <el-option
                  v-for="item in designer_option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-button type="primary" icon="el-icon-check" @click="openDrawer(p)" size="mini"
                         style="margin-left: 10px"
              >
                确定指派
              </el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <div class="approve">
      <h2 @click="showPlanApproveItem = !showPlanApproveItem">方案审批</h2>
      <div class="container" v-show="showPlanApproveItem">
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
                <button v-if="scope.row.tracker_info_num >0 && (scope.row.category==='1P Tracker' || scope.row.category==='2P Tracker')"
                        @click="showTrackerBom(scope.row)"
                >跟踪支架BOM
                </button>
                <button v-if="scope.row.tracker_info_num >0 && scope.row.category !=='1P Tracker' && scope.row.category !=='2P Tracker'"
                        @click="showOtherBom(scope.row.plan_code)"
                >导入BOM表
                </button>
              </template>
            </el-table-column>
            <el-table-column prop="design_version" label="变更号" width="80"></el-table-column>
            <el-table-column fixed="left" label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click="showDialogDirectorApprove(scope.row)" type="text" size="small">审批通过</el-button>
                <el-button @click="showDialogDirectorReject(scope.row)" type="text" size="small">审批驳回</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

<!--繁忙图表-->

    <div id="chart1" v-show="showBusynessChartsDiv"></div>

    <div class="drawer">
      <el-drawer
        title="确认指派设计"
        :visible.sync="drawer"
        :direction="direction"
        :destroy-on-close="true"
        size="50%"
        :before-close="handleClose"
      >
        <div v-if="drawerContext === 'assignment'" style="padding-left: 10px">
          <P>{{ confirmMsg }}</P>
          <P>如有内容需要向设计师补充，请在此输入(非必填项)：</P>
          <div style="width: 400px;padding-bottom: 10px">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容(500字以内)"
              v-model="sayToDesigners"
            >
            </el-input>
          </div>

          <el-button @click="drawer = false">取 消</el-button>
          <el-button type="primary" @click="assignment">确 定</el-button>
        </div>
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
        <TrackerIndex :msg="theBomMsg" :saveable="true"></TrackerIndex>
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
        <div v-if="ifShowNeedPricing">
          是否需要报价部门：
          <el-select v-model="isNeedPricing" placeholder="请选择">
            <el-option label="请选择" value="0" ></el-option>
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
  components: { TrackerIndex, tbImportBom, ProjectManagement },
  data() {
    return {
      theBomMsg:{},//查看Bom表时，要传给Bom表的信息
      thePlan: {},  //当前正在操作的方案
      thePlanCode:'',//正在操作的方案号

      theProject: {},  //保存正在操作的对象
      confirmMsg: '',
      sayToDesigners: '',  //指派设计师的的补充说明

      showDetailProjectCode: '',//显示项目详情时的项目号
      drawer: false,
      direction: 'ltr',
      drawerContext: 'assignment', //当为projectList 时，打开项目详情

      activeNames: ['1'],
      selectedDesigner: '',

      showProjectAssignmentItem: false,  //指派任务显示
      showPlanApproveItem: false,  //审批方案显示

      showBusynessChartsDiv:false,

      isNeedPricing:'请选择',  //是否需要报价部门填写价格
      ifShowNeedPricing:false,  //是否需要显示isNeedPricing(如果是驳回，就不需要显示 )

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
      drawerOtherBomVisible: false,

      chartData:{
        // name:['张三','李四','王五','赵六','钱七'],
        // struDesigner:[2,2,2,2,2],
        // geoDesigner:[3,3,3,3,2],
        // struChecker:[4,4,4,4,2],
        // geoChecker:[5,5,5,5,2],
      }
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
    showTrackerBom(plan) {
      console.log(plan)
      // console.log(plan)
      // console.log(project)
      this.theBomMsg = {
        planCode : plan.plan_code,
        planDesc : plan.plan_description,
        version : plan.version,
        designer : plan.designer,
        projectCode : plan.plan_code,
        seller : '',
        projectName : ''
      }
      //以抽屉方式打开跟踪支架报价工具，后面再完成
      this.drawerTrackerBomVisible = true
    },

    //其它类型支架，导入excel
    showOtherBom(planCode) {
      this.thePlanCode = planCode
      //以抽屉方式打开跟踪支架报价工具，后面再完成
      this.drawerOtherBomVisible = true
    },

    showChartDiv(){
      this.showBusynessCharts()
      this.showBusynessChartsDiv = !this.showBusynessChartsDiv
    },

    showBusynessCharts() {
      var chartDom = document.getElementById('chart1')
      var myChart = echarts.init(chartDom);
      var option
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {},
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: this.chartData.name
        },
        series: [
          {
            name: '结构设计',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.chartData.struDesigner
          },
          {
            name: '岩土设计',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.chartData.geoDesigner
          },
          {
            name: '设计校对',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.chartData.checker
          },
        ]
      };
      option && myChart.setOption(option);
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
    handleCloseExcelBom(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    handleCloseTrackerBom(done){
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
    fetchAssignmentProjectData() {
      this.listLoading = true
      fetch(process.env.VUE_APP_BASE_API + '/api/getDirectorAssignmentTask', {
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
          this.assignmentProjectList = r.data
          this.listLoading = false
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },
    fetchApprovePlanData() {
      fetch(process.env.VUE_APP_BASE_API + '/api/getPlanByStatusAndDirectorName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify({
          'plan_status': '1',
          'director_name': this.name
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
          this.myApprovePlanList = r.data.filter(p=>p.design_version === p.project_design_version)
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

    //获取繁忙相关数据
    fetchBusynessData() {
      fetch(process.env.VUE_APP_BASE_API + '/api/getBusynessData', {
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
            throw new Error('fetchBusynessData，Something went wrong on server side.')
          }
        })
        .then(r => {
          let a = r.data
          this.chartData.name=a.split('names:[')[1].split(']')[0].split(',')
          let struDesigner=a.split('struDesigner:[')[1].split(']')[0].split(',')
          let geoDesigner=a.split('geoDesigner:[')[1].split(']')[0].split(',')
          let checker=a.split('checker:[')[1].split(']')[0].split(',')
          this.chartData.struDesigner = []
          struDesigner.forEach(b=>this.chartData.struDesigner.push(parseInt(b)))
          this.chartData.geoDesigner = []
          geoDesigner.forEach(b=>this.chartData.geoDesigner.push(parseInt(b)))
          this.chartData.checker = []
          checker.forEach(b=>this.chartData.checker.push(parseInt(b)))
          this.showBusynessCharts()  //显示图表
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },

    openDrawer(projectObj) {
      this.drawerContext = 'assignment' //控制drawer打开内容为指派任务
      this.direction = 'ltr'
      this.theProject = projectObj
      this.drawer = true
      this.confirmMsg = `是否确认指定
      ${projectObj.designer} 为本项目 ${projectObj.name} 的设计师?`
    },

    assignment() {
      const obj = {
        name: this.name,
        id: this.theProject.id,
        project_name: this.theProject.project_name,
        designer: this.theProject.designer.join(',')
      }
      fetch(process.env.VUE_APP_BASE_API + '/api/assignmentTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/text',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify(obj)
      })
        .then(() => {
          this.addProjectLogAssignmentStructure(this.theProject.id)
          this.$message({
            type: 'success',
            message: '指定设计师成功!'
          })
          location.reload()
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

    getAllTechnicalEngineers() {
      let engineers = []
      fetch(process.env.VUE_APP_BASE_API + '/api/getAllTechnicalEngineers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: {}
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
          r.data.forEach(item => engineers.push(item.fullname))
          this.allTechnicalEngineers = engineers
          this.designer_option = []
          r.data.forEach(item => this.designer_option.push({ value: item.fullname, label: item.fullname }))
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
          return []
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
      this.ifShowNeedPricing = true
      this.theProject = this.myApproveProjectList.find((e) => e.code === row.project_code)
      this.thePlan = this.coverPlan(row)
      let action = '设计方案审批通过'
      let to_person=this.theProject.seller+','+row.designer
      if(this.isNeedPricing === 1){
        action = '价格申请'
        to_person='王柯,卜焕坡,'+row.designer
        this.thePlan.planStatus = '1a'  //将方案状态改为1a-审批通过，跳转到价格部门填写价格
      } else{
      }

      this.approveDialogTitle = '设计方案通过-' + this.theProject.name + '-' + row.plan_description
      this.theProjectLog = {
        project_code: row.project_code,
        action: '设计方案审批通过',
        action_remark: '方案名称:' + row.plan_description,
        role: '审批人',
        operator: this.name,
        to_person: this.theProject.seller+','+row.designer,
        to_id: row.id,
        content: ''
      }
      this.approveDialogVisible = true  //显示审批对话框
    },
    //技术总监审批驳回
    showDialogDirectorReject(row) {
      this.ifShowNeedPricing = false
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
      // if(this.isNeedPricing === '1' || this.isNeedPricing === '2'){
        let msg = ''
        this.theProjectLog.content = this.approveTextarea  //写入通过或驳回的意见
       if(this.ifShowNeedPricing){//通过操作，分为需要价格人员干预和不需要干预
         if(this.isNeedPricing === '1'){
           msg = '此操作将提交给价格人员进行价格填报或报价确认，是否继续'
           this.theProjectLog.action = '价格申请'
           this.theProjectLog.to_person = '王柯,卜焕坡'
           this.thePlan.planStatus = '1a'  //将方案状态改为1a-审批通过，跳转到价格部门填写价格
         } else if(this.isNeedPricing === '2'){
           this.thePlan.planStatus = '2'  //将方案状态改为2-审批通过，销售总监和销售经理都能看到了
           msg = '此操作将本方案提交给销售经理进行投标，是否继续'
         }
       }else{
         msg = '此操作将本方案退回给设计师重新修改设计，是否继续'
         this.thePlan.planStatus = '0'  //将检查状态改为0-退回到设计状态
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
          });
        });
      // }
      // else {
      //   this.$alert('必须选择是否需要价格部门填写材料价格', '提示信息缺失', {
      //     confirmButtonText: '确定',
      //     callback: action => {
      //       return
      //     }
      //   });
      //   return
      // }

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
          status:3
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
    }
  },

  mounted() {
    this.fetchAssignmentProjectData()  //找到要指派任务的项目列表
    this.fetchApprovePlanData()  //找到要审批的方案列表
    this.fetchDirectorProjectData() //找到技术总监负责的项目列表（未完工的项目）
    this.getAllTechnicalEngineers()  //找出所有技术工程师
    this.showBusynessCharts()
    this.fetchBusynessData()  //繁忙系数
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

#chart1 {
  width: 900px;
  height: 1200px;
  background-color: lightblue;
  border: 1px solid #000;
}
.link-item {
  font-size: 12px;
  color: #FFFFFF;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #409EFF;
}

</style>
