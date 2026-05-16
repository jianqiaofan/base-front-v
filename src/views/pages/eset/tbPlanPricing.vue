<template>
  <div id="plan-pricing-container">

    <div class="approve">
      <h2>方案报价</h2>
      <div class="container">
        <div>
          <el-table :data="myPricingPlanList" border style="width: 100%">
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
                >其它类型BOM
                </button>
              </template>
            </el-table-column>
            <el-table-column prop="design_version" label="变更号" width="80"></el-table-column>
            <el-table-column fixed="left" label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click="showDialogDirectorPricing(scope.row)" type="text" size="small">报价通过</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
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
        title="BOM清单"
        :visible.sync="drawerOtherBomVisible"
        direction="rtl"
        :destroy-on-close="true"
        size="100%"
        :before-close="handleCloseExcelBom"
      >
        <!--          <TrackerIndex></TrackerIndex>-->
        <tbImportBom :planCode="thePlanCode" :saveable="true" :modifiable="false" :bomindex="2"></tbImportBom>
      </el-drawer>
    </div>


    <!--校核报价对话框-->
    <div class="dialog-approve">
      <el-dialog :title="approveDialogTitle" :visible.sync="approveDialogVisible" width="40%"
                 :close-on-click-modal="false"
      >
        <p>原因或备注1</p>
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
            <el-button type="primary" icon="el-icon-check" @click="makeSurePricing()" size="small"
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
import tbImportBom from '@/views/pages/eset/tbImportBom.vue'
import TrackerIndex from '@/views/pages/eset/trackers2/TrackerIndex.vue'

export default {
  components: { TrackerIndex, tbImportBom, ProjectManagement },
  data() {
    return {
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
      showPlanPricingItem: false,  //报价方案显示

      showBusynessChartsDiv:false,

      myPricingPlanList: [],  //需要我报价的方案
      myPricingProjectList: [],//需要我报价的方案的项目

      //对话框相关
      approveTextarea: '',
      approveDialogTitle: '',//方案对话框标题
      approveDialogVisible: false,//方案对话框可视

      allTechnicalEngineers: [], //所有技术人员名单
      designer_option: [],  //designer选项卡

      drawerTrackerBomVisible: false,
      drawerOtherBomVisible: false,

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

    handleCloseTrackerBom(done) {
      done()
    },
    handleCloseExcelBom(done) {
      done()
    },
    handleChange(val) {
      console.log('###', val)
    },
    fetchPricingPlanData() {
      fetch(process.env.VUE_APP_BASE_API + '/api/getPlanByPlanStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify({
          'plan_status': '1a'
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
          this.myPricingPlanList = r.data.filter(p=>p.design_version === p.project_design_version)
          console.log("===",this.myPricingPlanList)
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

    //提交报价
    showDialogDirectorPricing(row) {
      this.thePlan = row
      this.approveDialogTitle = '设计方案通过-' + row.project_name + '-' + row.plan_description
      this.theProjectLog = {
        project_code: row.project_code,
        action: '设计方案报价通过',
        action_remark: '方案名称:' + row.plan_description,
        role: '报价人',
        operator: this.name,
        to_person: row.seller+','+row.designer,
        to_id: row.id,
        content: ''
      }
      this.approveDialogVisible = true  //显示报价对话框
    },

    //报价通过或驳回
     makeSurePricing() {
        let msg = ''
        this.theProjectLog.content = this.approveTextarea  //写入通过或驳回的意见
          msg = '此操作将本方案提交给销售经理进行投标，是否继续'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //修改方案表中的相关状态(this.thePlan中已含有变化)
          this.updatePlanStatus(this.thePlan.plan_code,this.thePlan.project_code)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消提交'
          });
        });


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

    //将方案状态变为2
    updatePlanStatus(planCode,projectCode){
      fetch(process.env.VUE_APP_BASE_API + '/api/pricingUpdatePlanStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify({ planCode:planCode })
      }).then(response => {
        // 确保服务器响应为成功状态码
        if (response.ok) {
          this.$message.success(response.message || '操作成功')
          //如果是报价通过，还要将项目表中状态改为设计已完成状态
          this.updataProjectStatus(projectCode)
          this.saveProjectLog(this.theProjectLog)//加一条项目日志
          this.fetchPricingPlanData()
        } else {
          // 如果响应状态码不是2xx，抛出错误
          throw new Error('Something went wrong on server side.')
        }
      }).catch((reason) => {
        alert('错误原因：' + reason)
      })
      this.approveDialogVisible = false
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
    this.fetchPricingPlanData()  //找到要报价的方案列表
  }

}
</script>

<style scoped>
#plan-pricing-container {
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
