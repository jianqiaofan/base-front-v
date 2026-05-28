<template>
  <div class="container">
    <!--    <div class="header">-->
    <!--      <span class="el-icon-full-screen">全屏</span>-->
    <!--      <span class="el-icon-close">关闭</span>-->
    <!--      {{ project_code }}-->
    <!--    </div>-->
    <div class="main">
      <div class="main-left">
        <div class="main-left-header">
          <div style="margin: 10px;">
            <span style="font-size: 20px;margin-right:10px">{{ theProject.name }}</span>
            <span style="font-size: 12px">{{ theProject.code }}|{{ theProject.category }}|{{ theProject.seller }}</span>
          </div>
          <el-steps :active="1*theProject.status" align-center :space="130">
            <el-step title="创建" :description="theProject.seller"></el-step>
            <el-step title="指派" :description="theProject.technical_director"></el-step>
            <el-step title="设计" :description="theProject.designer"></el-step>
            <el-step title="投标" :description="theProject.seller"></el-step>
            <el-step title="完成" description=""></el-step>
          </el-steps>
        </div>
        <div class="main-left-body">
          <div class="item">
            <el-alert
              class="el-icon-chat-dot-round"
              title="当前项目状态"
              type="warning"
              :closable="false"
              style="margin: 10px 0"
            >
            </el-alert>
            <el-alert
              class="el-icon-info"
              :title="projectCurrentStatus.title"
              type="info"
              :closable="false"
            >
              <div>
                {{ projectCurrentStatus.content }}
              </div>
            </el-alert>
          </div>

          <div class="item project-info">
            <el-row>
              <el-col :span="24">
                <div class="grid-content bg-purple-light">
                  <div class="title">项目名称</div>
                  <div class="content">{{ theProject.name }}</div>
                </div>
              </el-col>
              <!--              <el-col :span="12">-->
              <!--                <div class="grid-content bg-purple-light">-->
              <!--                  <div class="title">项目类别</div>-->
              <!--                  <div class="content">{{ theProject.category }}</div>-->
              <!--                </div>-->
              <!--              </el-col>-->
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <div class="title">项目创建时间</div>
                  <div class="content">{{ theProject.create_time }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <div class="title">要求完成时间</div>
                  <div class="content">{{ theProject.required_completion_time }}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <div class="title">项目所在地</div>
                  <div class="content">
                    {{ theProject.site }}
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <div class="title">支架类别</div>
                  <div class="content">{{ theProject.category }}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <div class="title">客户名称</div>
                  <div class="content">{{ theProject.client }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <div class="title">容量(MWdc)</div>
                  <div class="content">{{ theProject.capacity }}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <div class="title">销售经理</div>
                  <div class="content">{{ theProject.seller }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <div class="title">技术负责人</div>
                  <div class="content">{{ theProject.technical_director }}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <div class="title">结构工程师</div>
                  <div class="content">{{ theProject.designer }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <div class="title">岩土工程师</div>
                  <div class="content">{{ theProject.geotechnical }}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <div class="title">技术校对人</div>
                  <div class="content">{{ theProject.checker }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <div class="title"></div>
                  <div class="content"></div>
                </div>
              </el-col>
            </el-row>


            <el-row>
              <el-col :span="24" class="bg-purple-light">
                <div class="title">销售经理提资资料</div>
                <div class="content">
                  <el-link :href="theProject.data_link" type="success" target="_blank">{{ theProject.data_link }}
                  </el-link>
                </div>
              </el-col>
            </el-row>
          </div>

          <div class="item">
            <div class="">
              <h3>设计方案明细</h3>
            </div>
            <div class="item project-plan" v-for="p in theProjectPlanList.filter(p => p.plan_status === '2')" :key="p.id">
              <el-row>
                <div><span style="color:red;margin:0 auto">第{{ p.project_design_version }}版</span></div>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <div class="title">方案名称</div>
                    <div class="content">{{ p.plan_description }}</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple-light">
                    <div class="title">支架类别</div>
                    <div class="content">{{ p.category }}</div>
                  </div>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <div class="title">结构工程师</div>
                    <div class="content">{{ p.designer }}</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple-light">
                    <div class="title">结构校对人</div>
                    <div class="content">{{ p.stru_checker }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <div class="title">岩土工程师</div>
                    <div class="content">{{ p.geotechnical }}</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple-light">
                    <div class="title">岩土校对人</div>
                    <div class="content">{{ p.geo_checker }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" class="bg-purple">
                  <div class="title">设计成果资料链接地址(上部结构)</div>
                  <div class="content">
                    <el-link :href="p.stru_result_data_link" type="success"
                             target="_blank"
                    >
                      {{ p.stru_result_data_link !== null && p.stru_result_data_link.length > 20 ? '请点击查看' : '' }}
                    </el-link>
                  </div>
                </el-col>
                <el-col :span="12" class="bg-purple-light">
                  <div class="title">设计成果资料链接地址(岩土基础)</div>
                  <div class="content">
                    <el-link :href="p.geo_result_data_link" type="success"
                             target="_blank"
                    >
                      {{ p.stru_result_data_link !== null && p.geo_result_data_link.length > 20 ? '请点击查看' : '' }}
                    </el-link>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="bg-purple">
                  <!--                  <div class="title">设计成果资料链接地址(上部结构)</div>-->
                  <div class="content">
                    <el-button type="primary" v-if="p.tracker_info_num>0 && p.category.includes('Tracker')" size="mini"
                               @click="showPriceTable(p.plan_code)"
                    >报价结果
                    </el-button>
                    <el-button type="primary" v-if="p.tracker_info_num>0 && p.category.includes('Tracker')" size="mini"
                               @click="bomPermission(p.plan_code)" plain
                    >BOM清单
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>

        </div>
        <div class="main-left-footer">
          <el-button type="primary" size="mini" @click="addComment()">评论</el-button>
          <el-button type="primary" size="mini" @click="addExpedite()" plain>催办</el-button>
          <el-button type="primary" @click="getRoel">test</el-button>
          <!--          <el-button type="primary" size="mini" plain>项目进展反馈</el-button>-->
          <!--          <el-button type="primary" size="mini" plain>申请导出BOM</el-button>-->
        </div>
      </div>

      <div class="main-right">
        <div class="block">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
              placement="top"
            >
              <el-card>
                <div style="font-weight: bold;font-size: 1.1em">{{ activity.title }}</div>
                <div>备注:{{ activity.content }}</div>
                <div>操作人:{{ activity.operator }}</div>
                <div v-if="Array.isArray(activity.to_person) && activity.to_person.length>0">
                  指向人:{{ activity.to_person }}
                </div>
              </el-card>
            </el-timeline-item>

          </el-timeline>
        </div>
      </div>
    </div>


    <div class="dialog">
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%"
                 :close-on-click-modal="false" :modal="false"
      >
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="输入内容">
            <el-input type="textarea" v-model="form.textareaContent"></el-input>
          </el-form-item>
          <el-form-item label="发送对象">
            <el-checkbox-group v-model="form.toWho">
              <el-checkbox v-for="p in participants" :label=p name="type" :key="p.item"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="makeSureApprove()">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>


    <!--    方案细节-->
    <el-drawer
      title="方案报价综合计算"
      :visible.sync="drawerPlanResult"
      direction="ltr"
      :modal="false"
      size="100%"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <ResultForSeller
        :planResult="planResult"
        :projectAndPlan="projectAndPlanForSeller"
      ></ResultForSeller>
    </el-drawer>

    <!--    方案细节-->
    <el-drawer
      :title="drawerPlanBomTitle"
      :visible.sync="drawerPlanBom"
      direction="ltr"
      :modal="false"
      size="100%"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
    <div class="bom-list-container">
      <PlanBomListZh :planResult="planResult"></PlanBomListZh>
    </div>
    </el-drawer>




    <!--    Bom表-->
    <div class="dialog">
      <el-dialog :title="dialogTitle" :visible.sync="dialogPlanBomVisible" width="80%"
                 :close-on-click-modal="false" :modal="false"
      >
        <h2>材料清单</h2>
        <el-table
          :data="planResult.priceMsg"
          border
          :highlight-current-row="true"
          height="900px"
        >
          <el-table-column type="index" label="序号" width="50" :index="indexMethod"></el-table-column>
          <el-table-column prop="name" label="材料名称" width="250"></el-table-column>
          <el-table-column prop="specification" label="规格" width="300" :formatter="formatSpecification"></el-table-column>
          <el-table-column prop="material" label="材质" width="200"></el-table-column>
          <el-table-column prop="lenth" label="长度" width="100" :formatter="formatNumber2"></el-table-column>
          <el-table-column prop="unit" label="单位" width="60"></el-table-column>
          <el-table-column prop="totalAmount" label="数量" width="90"></el-table-column>
          <el-table-column prop="surfaceTreatment" label="表面处理" width="250"></el-table-column>
        </el-table>
        <div style="height: 600px"></div>
      </el-dialog>
    </div>
  </div>


</template>

<script>
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import myUtils from '@/api/eset/myUntils'
import planUtils from '@/views/pages/eset/trackers2/utils/planUtils.js'
import ResultForSeller from '@/views/pages/eset/trackers2/ResultForSeller'
import { Plan, Tracker } from '@/views/pages/eset/trackers2/utils/classPlan'
import PlanBomListZh from '@/views/pages/eset/trackers2/PlanBomListZh.vue'  

export default {
  name: 'ProjectManagement',
  components: { ResultForSeller, PlanBomListZh },
  data() {
    return {
      form: {
        textareaContent: '',
        toWho: []
      },
      theProject: {}, //获取项目信息
      theProjectPlanList: [],  //获取项目所有方案
      theProjectLog: [],  //获取项目日志
      activities: [],
      dialogTitle: '',
      dialogVisible: false,
      dialogPlanBomVisible: false,  //BOM表清单
      planResult: {},  //显示方案的结果
      adjustMsg: [],  //方案调价信息

      drawerPlanResult: false,  //方案结果页面
      drawerPlanBom: false,  //Bom清单
      drawerPlanBomTitle: 'Bom清单',  //Bom清单标题
      activePlanCode: ''  //当前打开报价/方案详情的方案编号
    }
  },

  computed: {
    ...mapGetters([
      'name'
    ]),
    projectAndPlanForSeller() {
      const p = this.theProject || {}
      const plan = (this.theProjectPlanList || []).find(pl => pl.plan_code === this.activePlanCode) || {}
      return {
        project_code: p.code || '',
        project_name: p.name || '',
        plan_description: plan.plan_description || '',
        seller: p.seller || '',
        designer: plan.designer || p.designer || '',
        plan_code: plan.plan_code || '',
        plan_capacity: plan.plan_capacity || '',
        tester:'fdsa'
      }
    },
    //项目当前的状态
    projectCurrentStatus() {
      let obj = {
        title: '项目正在进行中',
        content: ''
      }
      if (this.theProject.status === '1') {
        obj.title = `项目等待指派设计师`
        obj.content = `销售经理创建项目完成,等待技术负责人 ${this.theProject.technical_director} 指派设计师`
      } else if (this.theProject.status === '2') {
        if (Array.isArray(this.theProjectPlanList) && this.theProjectPlanList.length > 0) {  //当设计师创建项目时，表示设计开始
          obj.title = `项目正在设计中`
          obj.content = `${this.theProject.designer} 正在进行结构设计`
          if (Array.isArray(this.theProject.geotechnical) && this.theProject.geotechnical.length > 0) {
            obj.content += `,${this.theProject.geotechnical} 正在进行岩土和基础设计`
          }
        } else {
          obj.title = `等待设计师开始设计`
          obj.content = `已指派设计师 ${this.theProject.designer}，等待设计开始`
        }
      } else if (this.theProject.status === '3') {
        obj.title = `销售部门正在处理中`
        obj.content = `项目设计完成，销售总监和销售经理正在计算运费和利润等，并等待投标`
      } else if (this.theProject.status === '4') {
        obj.title = `项目结束`
        obj.content = `项目完成`
      }
      return obj
    },
    //项目参与人
    participants() {
      let a = []
      if (typeof (this.theProject.seller) === 'string' && this.theProject.seller !== this.name && this.theProject.seller.length > 1) {
        a.push('销售经理:' + this.theProject.seller)
      }
      if (typeof (this.theProject.designer) === 'string' && this.theProject.designer !== this.name && this.theProject.designer.length > 1) {
        a.push('结构设计师:' + this.theProject.designer)
      }
      if (typeof (this.theProject.geotechnical) === 'string' && this.theProject.geotechnical !== this.name && this.theProject.geotechnical.length > 1) {
        a.push('岩土工程师:' + this.theProject.geotechnical)
      }
      if (typeof (this.theProject.checker) === 'string' && this.theProject.checker !== this.name && this.theProject.checker.length > 1) {
        a.push('校对人员:' + this.theProject.checker)
      }
      if (typeof (this.theProject.technical_director) === 'string' && this.theProject.technical_director !== this.name && this.theProject.technical_director.length > 1) {
        a.push('技术负责人:' + this.theProject.technical_director)
      }
      a.push('市场总监:胡文')
      return a
    }
  },
  methods: {
    addComment() {
      this.dialogVisible = true
      //添加评论
      this.dialogTitle = '添加评论'
      this.theProjectLog = {
        project_code: this.theProject.code,
        action: '评论',
        action_remark: '',
        role: this.getRoel(),
        operator: this.name,
        to_person: '',
        to_id: '',
        content: this.textareaContent
      }
      this.dialogVisible = true

    },
    addExpedite() {
      //催办
      this.dialogTitle = '我要催办'
      this.theProjectLog = {
        project_code: this.theProject.code,
        action: '催办',
        action_remark: '',
        role: this.getRoel(),
        operator: this.name,
        to_person: '',
        to_id: '',
        content: this.textareaContent
      }
      this.dialogVisible = true
    },

    showPriceTable(planCode) {
      this.getThisPlanDetail(planCode)
      setTimeout(() => {
        this.drawerPlanResult = true
      }, 1000)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    bomPermission(planCode) {
      // alert('申请BOM表查看打印权限，正在开发中......')
      this.getThisPlanDetail(planCode)
      // this.dialogPlanBomVisible = true;
      setTimeout(()=>{
        console.log(this.theProject)
        this.drawerPlanBomTitle = this.theProject.name+'|'+this.theProject.code+'|' + 'Bom清单'
        this.drawerPlanBom = true
      },1000)

    },
    //获取我在项目中的角色
    getRoel() {
      if (this.theProject.seller !== null && this.theProject.seller.includes(this.name)) {
        return '销售经理'
      } else if (this.theProject.designer !== null && this.theProject.designer.includes(this.name)) {
        return '结构工程师'
      } else if (this.theProject.geotechnical !== null && this.theProject.geotechnical.includes(this.name)) {
        return '岩土工程师'
      } else if (this.theProject.checker !== null && this.theProject.checker.includes(this.name)) {
        return '校对人'
      } else if (this.theProject.technical_director !== null && this.theProject.technical_director.includes(this.name)) {
        return '技术负责人'
      } else if ('胡文' === this.name) {
        return '市场总监'
      } else {
        return this.name
      }

    },
    makeSureApprove() {
      this.theProjectLog.content = this.form.textareaContent  //写入通过或驳回的意见
      this.theProjectLog.to_person = this.form.toWho.map(p => p.split(':')[1]).join(',')  //评论或催办的对象
      this.saveProjectLog(this.theProjectLog)//加一条项目日志
    },

    //添加项目日志
    saveProjectLog(logObj) {
      this.dialogVisible = false
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
            this.$message.success(response.message || '操作成功')
            this.textareaContent = ''//将意见文本框内容清空
            this.fetchProjectLogData(this.project_code)
          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
    },

    //返回时间线的节点对象
    getTimeLineNodeObj(item) {
      const title = item.action
      const action_remark = item.action_remark
      const content = item.content
      const operator = item.operator
      const role = item.role
      const to_person = item.to_person
      const to_id = item.to_id

      let size = 'large '
      let type = 'primary'
      let icon = 'el-icon-info'
      let color = '#409EFF'

      if (item.action.includes('通过')) {
        type = 'success'
        icon = 'el-icon-info'
        color = '#67C23A'
      }
      if (item.action.includes('驳回')) {
        type = 'danger'
        icon = 'el-icon-info'
        color = '#F56C6C'
      }
      if (item.action.includes('催办')) {
        type = 'warning'
        icon = 'el-icon-info'
        color = '#E6A23C'
      }

      let dateTime = item.create_time
      try {
        let d = item.create_time.split(/[-:\s]/)  //字符串转为年月日时分秒数组
        d[1] = d[1] - 1  //月份是从0开始的
        let aLocal = new Date(...d) - 8 * 3600 * 1000
        dateTime = myUtils.getDateToString(new Date(aLocal))
      } catch (e) {
        console.log(e)
      }

      let rObj = {
        title: title,
        content: content,
        action_remark: action_remark,
        operator: operator,
        role: role,
        to_person: to_person,
        to_id: to_id,
        size: size,
        type: type,
        icon: icon,
        color: color,
        timestamp: dateTime
      }
      return rObj
    },

    //获取项目信息
    fetchProjectData(projectCode) {
      fetch(process.env.VUE_APP_BASE_API + '/api/getProjectByProjectCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: projectCode
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
          this.theProject = r.data[0]
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    //获取项目所有方案
    fetchProjectPlanListData(projectCode) {
      fetch(process.env.VUE_APP_BASE_API + '/api/getPlanByCodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: projectCode
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('Something went wrong on server side.')
          }
        })
        .then(r => {
          this.theProjectPlanList = r.data
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },
    //获取项目日志
    fetchProjectLogData(projectCode) {
      fetch(process.env.VUE_APP_BASE_API + '/api/getProjectLogByProjectCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: projectCode
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
          this.theProjectLog = r.data
          this.activities = []
          if (Array.isArray(this.theProjectLog) && this.theProjectLog.length > 0) {
            this.theProjectLog.forEach(item => {
              this.activities.push(this.getTimeLineNodeObj(item))
            })
          }
        })
    },
    //获取方案
    getThisPlanDetail(planCode) {
      this.activePlanCode = planCode
      fetch(process.env.VUE_APP_BASE_API + '/api/findPlanDetail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: planCode
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
        .then(async r => {
          if (r.data.trim().length > 10) {
            let module_data = this.resultCoverToPlan(r.data)
            await this.getAdjustPrice(planCode)
            this.planResult = planUtils.planCompute(module_data, this.adjustMsg)
          }
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },

    //获取本方案的调价信息
    getAdjustPrice(planCode) {
      return fetch(process.env.VUE_APP_BASE_API + '/api/getPlanAdjustPrice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify({
          plan_code: planCode
        })
      })
        .then(response => {
          // 确保服务器响应为成功状态码
          if (response.ok) {
            // 获取响应体中的JSON数据
            return response.json()
          }
          alert('获取调价信息出错，请刷新页面试一下')
          return Promise.reject(new Error('getPlanAdjustPrice failed'))
        })
        .then(r => {
          this.adjustMsg = r.data  //将调价信息保存
          return r.data
        })
    },

    //将结果字符串转为plan对象
    resultCoverToPlan(data) {
      let planObj = JSON.parse(data)
      let plan = new Plan()
      // 遍历 obj 对象的键值对
      for (const [key, value] of Object.entries(planObj)) {
        // 如果 plan 中有对应的属性，则更新它的值
        if (plan.hasOwnProperty(key)) {
          plan[key] = value
        }
      }
      for (let i = 0; i < plan.trackersInfo.length; i++) {
        let t = new Tracker()
        for (const [key, value] of Object.entries(plan.trackersInfo[i])) {
          // 如果 plan 中有对应的属性，则更新它的值
          if (t.hasOwnProperty(key)) {
            t[key] = value
          }
        }
        plan.trackersInfo[i] = t
      }
      return plan
    },
    indexMethod(index) {
      return index + 1
    },
    formatNumber2(row, column, cellValue) {
      if (typeof (cellValue) === 'number') {
        if (cellValue === 0) {
          return ''
        }
        if (Number.isInteger(cellValue)) {
          return cellValue // 如果是整数，直接返回该数字
        } else {
          return cellValue.toFixed(2)
        }
      } else {
        return cellValue
      }
    },
    formatNumber3(row, column, cellValue) {
      if (typeof (cellValue) === 'number') {
        if (cellValue === 0) {
          return ''
        }
        if (Number.isInteger(cellValue)) {
          return cellValue // 如果是整数，直接返回该数字
        } else {
          return cellValue.toFixed(3)
        }
      } else {
        return cellValue
      }
    },
    formatNumber6(row, column, cellValue) {
      if (typeof (cellValue) === 'number') {
        if (cellValue === 0) {
          return ''
        }
        if (Number.isInteger(cellValue)) {
          return cellValue // 如果是整数，直接返回该数字
        } else {
          return cellValue.toFixed(6)
        }
      } else {
        return cellValue
      }
    },
    formatSpecification(row, column, cellValue) {
      if (['04', '05', '06'].includes(row.priceId.substring(0, 2))) {
        return ''
      } else {
        return cellValue
      }
    }
  },
  props: {
    project_code: ''
  },
  mounted() {
    this.fetchProjectData(this.project_code)
    this.fetchProjectPlanListData(this.project_code)
    this.fetchProjectLogData(this.project_code)
  }

}


</script>

<style scoped>
.container {
  padding-left: 2px;
  width: 900px;
  background-color: #e6eaef;
}

.header {
  height: 30px;
}

.header,
.main-left,
.main-right {
  background-color: rgb(226, 219, 216);
  border: 1px solid #ddd2d2;
}

.header,
.main {
  display: flex;
}

.header span {
  margin: 6px 10px;
}

.header {
  justify-content: end;
}

.main-left,
.main-right {
  /* height: 900px; */
  height: calc(100vh - 160px);
}

.main-left {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}

.main-right {
  flex: 0 0 600px;
  overflow: hidden;
  overflow-y: auto;
}

.main-left .item {
  background-color: #fff;
  border: 1px solid #bbb;
}

.main-right,
.main-left-header,
.main-left-body,
.main-left-footer {
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #bbb;
}

.main-left-header {
  flex: 0 0 80px;
}

.main-left-body {
  flex: 1 1 600px;
  overflow: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.main-left-body .item {
  flex: 0 0 100px;
  background-color: #fff;
  border: 1px solid black;
  border-radius: 6px;
  margin: 2px 0;
}

.project-info {
  flex: 0 0 600px;
}

.main-left-footer {
  flex: 0 0 40px;
  padding: 10px
}

.el-row {
  margin: 8px 2px;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;

}


div.title {
  color: #666666;
  font-size: 12px;
}

div.content {
  font-size: 14px;
}

table {
  margin-left: 10px;
  border-collapse: collapse; /* 确保边框不会重叠 */
  border: 1px solid black; /* 设置表格边框颜色和宽度 */
}

caption {
  text-align: left;
  height: 30px;
}

th, td {
  border: 1px solid black; /* 设置表格内部单元格边框颜色和宽度 */
  text-align: center;
}

.block {
  margin: 10px 0;
}


</style>






