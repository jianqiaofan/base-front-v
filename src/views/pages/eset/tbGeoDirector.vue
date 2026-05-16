<template>
  <div id="app-container">
    <div class="badges">
      <div class="div-badge" @click="showProjectAssignmentItem = !showProjectAssignmentItem">
        <el-badge :value="allGeoPlanList.filter(p=>p.geo_check_status === '0').length" class="item"
                  :type="allGeoPlanList.filter(p=>p.geo_check_status === '0').length>0?'danger':'primary'"
        >
          <el-button size="small">岩土方案指派</el-button>
        </el-badge>
      </div>
      <div class="div-badge" @click="showPlanApproveItem = !showPlanApproveItem">
        <el-badge :value="allGeoPlanList.filter(p=>p.geo_check_status === '2').length" class="item"
                  :type="allGeoPlanList.filter(p=>p.geo_check_status === '2').length>0?'danger':'primary'"
        >
          <el-button size="small">方案校对审批</el-button>
        </el-badge>
      </div>
      <div class="div-badge" @click="showPlanGeoIngItem = !showPlanGeoIngItem">
        <el-badge :value="allGeoPlanList.filter(p=>p.geo_check_status === '1').length" class="item"
                  :type="allGeoPlanList.filter(p=>p.geo_check_status === '1').length>0?'danger':'primary'"
        >
          <el-button size="small">方案设计中</el-button>
        </el-badge>
      </div>
      <div class="div-badge" @click="showChartDiv">
        <el-badge :value="1" class="item" type="primary">
          <el-button size="small">繁忙程度表</el-button>
        </el-badge>
      </div>
    </div>
    <!--指派========================================================================================================-->
    <div class="assignment">
      <h2 @click="showProjectAssignmentItem = !showProjectAssignmentItem">岩土任务指派</h2>
      <div class="container" v-show="showProjectAssignmentItem">
        <div>
          <el-table :data="allGeoPlanList.filter(p=>p.geo_check_status === '0')" border style="width: 100%">
            <el-table-column prop="project_code" label="项目编号" width="120" sortable>
              <template slot-scope="scope">
                <el-button @click="projectDetails(scope.row.project_code)" type="text" size="small">
                  {{ scope.row.project_code }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="project_name" label="项目名称" width="300" sortable></el-table-column>
            <el-table-column prop="plan_description" label="方案名称" width="300" sortable></el-table-column>
            <el-table-column prop="category" label="结构类型" width="140"></el-table-column>
            <el-table-column prop="geo_required_completion_time" label="要求完成时间" width="160"></el-table-column>
            <el-table-column prop="designer" label="结构工程师" width="140">
            </el-table-column>
            <el-table-column prop="geo_result_data_link" label="岩土提资资料" width="220"
                             :formatter="formatDataLink"
            >
              <template slot-scope="scope">
                <a style="color:#20a0ff" :href="scope.row.stru_result_data_link" target="_blank"
                >{{ scope.row.stru_result_data_link|filterLink(30) }}</a>
              </template>
            </el-table-column>
            <el-table-column label="岩土工程师" width="150">
              <template slot-scope="scope">
                <button @click="showDialogAssignment(scope.row)">指派
                </button>
              </template>
            </el-table-column>
            <el-table-column prop="design_version" label="变更号" width="80"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!--审批========================================================================================================-->
    <div class="approve">
      <h2 @click="showPlanApproveItem = !showPlanApproveItem">岩土方案审批</h2>
      <div class="container" v-show="showPlanApproveItem">
        <div>
          <el-table :data="allGeoPlanList.filter(p=>p.geo_check_status === '2')" border style="width: 100%">
            <el-table-column prop="project_code" label="项目编号" width="120" sortable>
              <template slot-scope="scope">
                <el-button @click="projectDetails(scope.row.project_code)" type="text" size="small">
                  {{ scope.row.project_code }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="project_name" label="项目名称" width="300" sortable></el-table-column>
            <el-table-column prop="plan_description" label="方案名称" width="300" sortable></el-table-column>
            <el-table-column prop="category" label="结构类型" width="140"></el-table-column>
            <el-table-column prop="designer" label="结构工程师" width="140"></el-table-column>
            <el-table-column prop="geo_required_completion_time" label="要求完成时间" width="160"></el-table-column>
            <el-table-column prop="geotechnical" label="岩土工程师" width="140"></el-table-column>
            <el-table-column prop="data_link_to_geotechnical" label="岩土提资资料" width="220"
                             :formatter="formatDataLink"
            >
              <template slot-scope="scope">
                <a style="color:#20a0ff" :href="scope.row.data_link_to_geotechnical" target="_blank"
                >{{ scope.row.data_link_to_geotechnical|filterLink(30) }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="geo_result_data_link" label="待校核资料" width="220"
                             :formatter="formatDataLink"
            >
              <template slot-scope="scope">
                <a style="color:#20a0ff" :href="scope.row.geo_result_data_link" target="_blank"
                >{{ scope.row.geo_result_data_link|filterLink(30) }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="design_version" label="变更号" width="80"></el-table-column>
            <el-table-column fixed="left" label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click="showDialogDirectorApprove(scope.row)" type="text" size="small">校对通过</el-button>
                <el-button @click="showDialogDirectorReject(scope.row)" type="text" size="small">校对驳回</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!--查看正在设计的方案========================================================================================================-->
    <div class="approve">
      <h2 @click="showPlanGeoIngItem = !showPlanGeoIngItem">正在设计中</h2>
      <div class="container" v-show="showPlanGeoIngItem">
        <div>
          <el-table :data="allGeoPlanList.filter(p=>p.geo_check_status === '1')" border style="width: 100%">
            <el-table-column prop="project_code" label="项目编号" width="120" sortable>
              <template slot-scope="scope">
                <el-button @click="projectDetails(scope.row.project_code)" type="text" size="small">
                  {{ scope.row.project_code }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="project_name" label="项目名称" width="300" sortable></el-table-column>
            <el-table-column prop="plan_description" label="方案名称" width="300" sortable></el-table-column>
            <el-table-column prop="category" label="结构类型" width="140"></el-table-column>
            <el-table-column prop="designer" label="结构工程师" width="140"></el-table-column>
            <el-table-column prop="geotechnical" label="岩土工程师" width="140"></el-table-column>
            <el-table-column prop="data_link_to_geotechnical" label="岩土提资资料" width="220"
                             :formatter="formatDataLink"
            >
              <template slot-scope="scope">
                <a style="color:#20a0ff" :href="scope.row.stru_result_data_link" target="_blank"
                >{{ scope.row.stru_result_data_link|filterLink(30) }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="geo_result_data_link" label="待校核资料" width="220"
                             :formatter="formatDataLink"
            >
              <template slot-scope="scope">
                <a style="color:#20a0ff" :href="scope.row.stru_result_data_link" target="_blank"
                >{{ scope.row.stru_result_data_link|filterLink(30) }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="design_version" label="变更号" width="80"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!--查看正在设计的方案========================================================================================================-->
    <div class="approve">
      <h2 @click="showPlanGeoIngItem = !showPlanGeoIngItem">已完成</h2>
      <div class="container" v-show="showPlanGeoIngItem">
        <div>
          <el-table :data="allGeoPlanList.filter(p=>p.geo_check_status === '3')" border style="width: 100%">
            <el-table-column prop="project_code" label="项目编号" width="120" sortable>
              <template slot-scope="scope">
                <el-button @click="projectDetails(scope.row.project_code)" type="text" size="small">
                  {{ scope.row.project_code }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="project_name" label="项目名称" width="300" sortable></el-table-column>
            <el-table-column prop="plan_description" label="方案名称" width="300" sortable></el-table-column>
            <el-table-column prop="category" label="结构类型" width="140"></el-table-column>
            <el-table-column prop="designer" label="结构工程师" width="140"></el-table-column>
            <el-table-column prop="geotechnical" label="岩土工程师" width="140"></el-table-column>
            <el-table-column prop="data_link_to_geotechnical" label="岩土提资资料" width="220"
                             :formatter="formatDataLink"
            >
              <template slot-scope="scope">
                <a style="color:#20a0ff" :href="scope.row.data_link_to_geotechnical" target="_blank"
                >{{ scope.row.data_link_to_geotechnical|filterLink(30) }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="geo_result_data_link" label="待校核资料" width="220"
                             :formatter="formatDataLink"
            >
              <template slot-scope="scope">
                <a style="color:#20a0ff" :href="scope.row.geo_result_data_link" target="_blank"
                >{{ scope.row.geo_result_data_link|filterLink(30) }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="design_version" label="变更号" width="80"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>


    <!--繁忙图表-->

    <el-divider></el-divider>
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


    <!--指派岩土对话框-->
    <div class="dialog-assignment">
      <el-dialog title="指派岩土工程师对话框" :visible.sync="assignmentDialogVisible" width="40%"
                 :close-on-click-modal="false"
      >
        <p>指定工程师</p>
          <el-select v-model="thePlan.geotechnical" placeholder="please select">
            <el-option
              v-for="item in designer_option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        <p>说明或备注</p>
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
            <el-button @click="assignmentDialogVisible = false" size="small" icon="el-icon-refresh-right"
            >取 消</el-button>
            <el-button type="primary" icon="el-icon-check" @click="makeSureAssignment()" size="small"
            >确 定</el-button>
          </span>
      </el-dialog>
    </div>

    <!--校核审批对话框-->
    <div class="dialog-approve">
      <el-dialog :title="approveDialogTitle" :visible.sync="approveDialogVisible" width="40%"
                 :close-on-click-modal="false"
      >
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

      showProjectAssignmentItem: false,  //指派任务显示
      showPlanApproveItem: false,  //审批方案显示
      showPlanGeoIngItem: false,  //正在设计中的项目

      showBusynessChartsDiv: false,

      isNeedPricing: '请选择',  //是否需要报价部门填写价格

      assignmentProjectList: [],  //需要我指派任务的项目
      myApprovePlanList: [],  //需要我审批的方案
      myApproveProjectList: [],//需要我审批的方案的项目
      allGeoPlanList: [],//全部需要岩土设计的方案

      //对话框相关
      assignmentTextarea: '',  //指派时留言
      approveTextarea: '',  //校对通过或驳回时留言
      approveDialogTitle: '',//方案对话框标题
      approveDialogVisible: false,//方案对话框可视
      assignmentDialogVisible: false,//指派岩土工程师对话框可视

      allTechnicalEngineers: [], //所有技术人员名单
      designer_option: [],  //designer选项卡

      chartData: {}
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
    showChartDiv() {
      this.showBusynessCharts()
      this.showBusynessChartsDiv = !this.showBusynessChartsDiv
    },

    showBusynessCharts() {
      var chartDom = document.getElementById('chart1')
      var myChart = echarts.init(chartDom)
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
          }
        ]
      }
      option && myChart.setOption(option)
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
    handleChange(val) {
      console.log('###', val)
    },

    fetchGeoDirectorPlanData() {
      fetch(process.env.VUE_APP_BASE_API + '/api/getGeoDirectorPlan', {
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
          console.log('fetchGeoDirectorPlanData', r.data)
          this.allGeoPlanList = r.data

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
          this.chartData.name = a.split('names:[')[1].split(']')[0].split(',')
          let struDesigner = a.split('struDesigner:[')[1].split(']')[0].split(',')
          let geoDesigner = a.split('geoDesigner:[')[1].split(']')[0].split(',')
          let checker = a.split('checker:[')[1].split(']')[0].split(',')
          this.chartData.struDesigner = []
          struDesigner.forEach(b => this.chartData.struDesigner.push(parseInt(b)))
          this.chartData.geoDesigner = []
          geoDesigner.forEach(b => this.chartData.geoDesigner.push(parseInt(b)))
          this.chartData.checker = []
          checker.forEach(b => this.chartData.checker.push(parseInt(b)))
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

    //指派岩土设计师
    showDialogAssignment(row){
      this.theProject = this.myApproveProjectList.find((e) => e.code === row.project_code)
      this.thePlan = this.coverPlan(row)
      this.thePlan.geoCheckStatus = '1'//岩土方案改为设计中
      this.approveDialogTitle = '指派岩土工程师-' + row.project_name + '-' + row.plan_description
      this.theProjectLog = {
        project_code: row.project_code,
        action: '指派岩土工程师',
        action_remark: '方案名称:' + row.plan_description,
        role: '岩土技术负责人',
        operator: this.name,
        to_person: row.designer + ',' + row.geotechnical,
        to_id: row.id,
        content: ''
      }
      this.assignmentDialogVisible = true  //显示审批对话框
    },

    //岩土方案校对通过
    showDialogDirectorApprove(row) {
      this.theProject = this.myApproveProjectList.find((e) => e.code === row.project_code)
      this.thePlan = this.coverPlan(row)
      this.thePlan.geoCheckStatus = '3'//岩土方案退回到设计状态
      this.thePlan.geoChecker = this.name //岩土方案校对人
      this.approveDialogTitle = '岩土方案通过-' + row.project_name + '-' + row.plan_description
      this.theProjectLog = {
        project_code: row.project_code,
        action: '岩土方案校对通过',
        action_remark: '方案名称:' + row.plan_description,
        role: '岩土技术负责人',
        operator: this.name,
        to_person: row.designer + ',' + row.geotechnical,
        to_id: row.id,
        content: ''
      }
      this.approveDialogVisible = true  //显示审批对话框
    },
    //岩土方案校对驳回
    showDialogDirectorReject(row) {
      this.theProject = this.myApproveProjectList.find((e) => e.code === row.project_code)
      this.thePlan = this.coverPlan(row)
      this.thePlan.geoCheckStatus = '1'//岩土方案退回到设计状态
      this.approveDialogTitle = '岩土方案驳回-' + row.project_name + '-' + row.plan_description
      this.theProjectLog = {
        project_code: row.project_code,
        action: '岩土方案校对驳回',
        action_remark: '方案名称:' + row.plan_description,
        role: '岩土技术负责人',
        operator: this.name,
        to_person: row.geotechnical,
        to_id: row.id,
        content: ''
      }
      this.approveDialogVisible = true  //显示审批对话框
    },

    //确认指派岩土设计师fdsa
    makeSureAssignment(){
      if(this.thePlan.geotechnical === undefined || this.thePlan.geotechnical.trim() === ''){
        this.$message.error('必须选中一个工程师进行指派')
        return
      }
      let msg = `确认指定【${this.thePlan.geotechnical}】为本项目方案的岩土工程师，是否继续?`
      this.theProjectLog.content = this.approveTextarea  //写入通过或驳回的意见
      this.$confirm(msg, '指派确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //修改方案表中的相关状态(this.thePlan中已含有变化)
        apiPlan.updateById(this.thePlan).then(response => {
          this.$message.success(response.message || '操作成功')
          this.updateProjectGeotechnical(this.thePlan.projectCode)  //更新岩土工程师和校对人员的名字写入到项目表中
          this.saveProjectLog(this.theProjectLog)//加一条项目日志
          this.fetchGeoDirectorPlanData()
        }).catch((reason) => {
          alert('错误原因：' + reason)
        })
        this.assignmentDialogVisible = false
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消提交'
        })
      })
    },
    //审批通过或驳回
    makeSureApprove() {
      let msg = '此操作将本通过本岩土方案，并通知结构设计师，是否继续'
      let msg_title = '校对通过确认'
      if (this.thePlan.geoCheckStatus === '1') {  //
        msg = '此操作将本驳回本岩土方案，返回岩土工程师重新设计，是否继续'
        msg_title = '校对驳回确认'
      }
      this.theProjectLog.content = this.approveTextarea  //写入通过或驳回的意见
      this.$confirm(msg, '校对通过确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //修改方案表中的相关状态(this.thePlan中已含有变化)
        apiPlan.updateById(this.thePlan).then(response => {
          this.$message.success(response.message || '操作成功')
          this.saveProjectLog(this.theProjectLog)//加一条项目日志
          this.fetchGeoDirectorPlanData()
          // 如果审批通过，将岩土设计师和岩土校对人写入到工程表中
          if (this.thePlan.geoCheckStatus === '3') {  //
            this.updataProjectGeo()
          }

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
    },
    //如果审批通过，将岩土设计师和岩土校对人写入到工程表中
    updataProjectGeo(project_code) {
      fetch(process.env.VUE_APP_BASE_API + '/api/updataProjectGeo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/text',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify({
          project_code: project_code,
        })
      })
        .then(() => {
          //后面再处理
        })
    },

    //更新岩土工程师和校对人员的名字写入到项目表中
    updateProjectGeotechnical(projectCode) {
      fetch(process.env.VUE_APP_BASE_API + '/api/updateProjectGeoTechnicalAndCheckerByCodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/text',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify(projectCode)
      })
        .then(response => {
          // 确保服务器响应为成功状态码
          if (response.ok) {
            // 获取响应体中的JSON数据
          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
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
    this.fetchGeoDirectorPlanData()  //获取所有需要岩土工程师的方案
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
