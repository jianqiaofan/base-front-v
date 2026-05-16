<template>
  <div id="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="等待立项" name="first">
        <el-table
          v-loading="listLoading"
          :data="about_my_projects_wait"
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
              <el-button @click="projectDetails(scope.row.code)" type="text" size="small">{{ scope.row.code }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button @click="showDialogCreateApprove(scope.row)" type="text" size="small">通过立项</el-button>
              <el-button @click="showDialogCreateReject(scope.row)" type="text" size="small">驳回立项</el-button>
            </template>
          </el-table-column>
          <el-table-column sortable prop="name" label="project name"/>
          <el-table-column sortable prop="site" label="site"/>
          <el-table-column sortable prop="seller" label="seller"/>
          <el-table-column sortable prop="category" label="category"/>
          <el-table-column sortable prop="client" label="client"/>
          <el-table-column sortable prop="capacity" label="capacity"/>
          <el-table-column prop="status" label="status" :formatter="statusToStr"/>
          <el-table-column prop="technical_director" label="technical director"/>
          <el-table-column sortable prop="designer" label="designer"/>
          <el-table-column sortable prop="geotechnical" label="geotechnical"/>
          <el-table-column sortable prop="checker" label="checker"/>
          <el-table-column sortable prop="required_completion_time" label="required time"/>
          <el-table-column sortable prop="create_time" label="creat time"/>
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
                <el-form-item label="capacity">
                  <span>{{ props.row.capacity }}</span>
                </el-form-item>
                <el-form-item label="client">
                  <span>{{ props.row.client }}</span>
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
      </el-tab-pane>
      <el-tab-pane label="正在设计中" name="second">
        <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入搜索关键字"
          @select="handleSelect"
          style="width: 600px;"
        ></el-autocomplete>
        <el-button @click="reset" type="success">重置</el-button>
        <el-table
          v-loading="listLoading"
          :data="about_my_projects_designing"
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
              <el-button @click="projectDetails(scope.row.code)" type="text" size="small">{{ scope.row.code }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column sortable prop="name" label="project name"/>
          <el-table-column sortable prop="site" label="site"/>
          <el-table-column sortable prop="seller" label="seller"/>
          <el-table-column sortable prop="category" label="category"/>
          <el-table-column sortable prop="client" label="client"/>
          <el-table-column sortable prop="capacity" label="capacity"/>
          <el-table-column prop="status" label="status" :formatter="statusToStr"/>
          <el-table-column prop="technical_director" label="technical director"/>
          <el-table-column sortable prop="designer" label="designer"/>
          <el-table-column sortable prop="geotechnical" label="geotechnical"/>
          <el-table-column sortable prop="checker" label="checker"/>
          <el-table-column sortable prop="required_completion_time" label="required time"/>
          <el-table-column sortable prop="create_time" label="creat time"/>
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
                <el-form-item label="capacity">
                  <span>{{ props.row.capacity }}</span>
                </el-form-item>
                <el-form-item label="client">
                  <span>{{ props.row.client }}</span>
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
      </el-tab-pane>
      <el-tab-pane label="销售正在处理中" name="third">
        <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入搜索关键字"
          @select="handleSelect"
          style="width: 600px;"
        ></el-autocomplete>
        <el-button @click="reset" type="success">重置</el-button>
        <el-table
          v-loading="listLoading"
          :data="about_my_projects_selling"
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
              <el-button @click="projectDetails(scope.row.code)" type="text" size="small">{{ scope.row.code }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column sortable prop="name" label="project name"/>
          <el-table-column sortable prop="site" label="site"/>
          <el-table-column sortable prop="seller" label="seller"/>
          <el-table-column sortable prop="category" label="category"/>
          <el-table-column sortable prop="client" label="client"/>
          <el-table-column sortable prop="capacity" label="capacity"/>
          <el-table-column prop="status" label="status" :formatter="statusToStr"/>
          <el-table-column prop="technical_director" label="technical director"/>
          <el-table-column sortable prop="designer" label="designer"/>
          <el-table-column sortable prop="geotechnical" label="geotechnical"/>
          <el-table-column sortable prop="checker" label="checker"/>
          <el-table-column sortable prop="required_completion_time" label="required time"/>
          <el-table-column sortable prop="create_time" label="creat time"/>
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
                <el-form-item label="capacity">
                  <span>{{ props.row.capacity }}</span>
                </el-form-item>
                <el-form-item label="client">
                  <span>{{ props.row.client }}</span>
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
      </el-tab-pane>
      <el-tab-pane label="已完成项目" name="forth">
        <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入搜索关键字"
          @select="handleSelect"
          style="width: 600px;"
        ></el-autocomplete>
        <el-button @click="reset" type="success">重置</el-button>
        <el-table
          v-loading="listLoading"
          :data="about_my_projects_finished"
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
              <el-button @click="projectDetails(scope.row.code)" type="text" size="small">{{ scope.row.code }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column sortable prop="name" label="project name"/>
          <el-table-column sortable prop="site" label="site"/>
          <el-table-column sortable prop="seller" label="seller"/>
          <el-table-column sortable prop="category" label="category"/>
          <el-table-column sortable prop="client" label="client"/>
          <el-table-column sortable prop="capacity" label="capacity"/>
          <el-table-column prop="status" label="status" :formatter="statusToStr"/>
          <el-table-column prop="technical_director" label="technical director"/>
          <el-table-column sortable prop="designer" label="designer"/>
          <el-table-column sortable prop="geotechnical" label="geotechnical"/>
          <el-table-column sortable prop="checker" label="checker"/>
          <el-table-column sortable prop="required_completion_time" label="required time"/>
          <el-table-column sortable prop="create_time" label="creat time"/>
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
                <el-form-item label="capacity">
                  <span>{{ props.row.capacity }}</span>
                </el-form-item>
                <el-form-item label="client">
                  <span>{{ props.row.client }}</span>
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
      </el-tab-pane>
      <el-tab-pane label="全部项目" name="five">
        <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入搜索关键字"
          @select="handleSelect"
          style="width: 600px;"
        ></el-autocomplete>
        <el-button @click="reset" type="success">重置</el-button>
        <el-table
          v-loading="listLoading"
          :data="about_all_my_projects"
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
              <el-button @click="projectDetails(scope.row.code)" type="text" size="small">{{ scope.row.code }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column sortable prop="name" label="project name"/>
          <el-table-column sortable prop="site" label="site"/>
          <el-table-column sortable prop="seller" label="seller"/>
          <el-table-column sortable prop="category" label="category"/>
          <el-table-column sortable prop="client" label="client"/>
          <el-table-column sortable prop="capacity" label="capacity"/>
          <el-table-column prop="status" label="status" :formatter="statusToStr"/>
          <el-table-column prop="technical_director" label="technical director"/>
          <el-table-column sortable prop="designer" label="designer"/>
          <el-table-column sortable prop="geotechnical" label="geotechnical"/>
          <el-table-column sortable prop="checker" label="checker"/>
          <el-table-column sortable prop="required_completion_time" label="required time"/>
          <el-table-column sortable prop="create_time" label="creat time"/>
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
                <el-form-item label="capacity">
                  <span>{{ props.row.capacity }}</span>
                </el-form-item>
                <el-form-item label="client">
                  <span>{{ props.row.client }}</span>
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
      </el-tab-pane>
    </el-tabs>

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
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import ProjectManagement from '@/views/pages/eset/trackers2/ProjectManagement.vue'

export default {
  components: { ProjectManagement },
  data() {
    return {
      restaurants: [],
      state: '',
      timeout: null,

      //drawer控件
      theProject: {},  //保存正在操作的对象
      confirmMsg: '',
      showDetailProjectCode: '',//显示项目详情时的项目号
      drawer: false,
      direction: 'ltr',
      drawerContext: 'assignment', //当为projectList 时，打开项目详情

      listLoading: true, // 数据是否正在加载
      list: [], // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      activeName: 'first',
      about_all_my_projects: [],
      about_my_projects_wait: [],  //等待立项确认
      about_my_projects_designing: [],  //正在设计中的项目
      about_my_projects_selling: [],  //销售正在处理的项目
      about_my_projects_finished: [],  //已完成的项目

      //对话框相关
      approveTextarea: '',
      approveDialogTitle: '',//方案对话框标题
      approveDialogVisible: false,//方案对话框可视
      approveStatus: 0  //审批后项目状态
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
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
    fetchAllProjectData() {
      this.listLoading = true
      fetch(process.env.VUE_APP_BASE_API + '/api/findAllProjects', {
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
          this.about_all_my_projects = JSON.parse(JSON.stringify(r.data))
          this.about_all_my_projects_bak = JSON.parse(JSON.stringify(r.data))
          this.restaurants = []
          this.about_all_my_projects.forEach(item => {
            let s = `${item.code}|${item.name}|${item.seller}|${item.designer}|${item.geotechnical}`.replaceAll('null', '')
            this.restaurants.push({ value: s, code: item.code })
          })
          this.about_my_projects_wait = r.data.filter(p => p.status === '0')
          this.about_my_projects_designing = r.data.filter(p => p.status === '1' || p.status === '2')
          this.about_my_projects_selling = r.data.filter(p => p.status === '3')
          this.about_my_projects_finished = r.data.filter(p => p.status === '4')

          this.listLoading = false
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },

    //销售总监同意立项
    showDialogCreateApprove(row) {
      console.log(row)
      this.theProject = row
      this.approveDialogTitle = '同意立项对话框'
      this.approveStatus = '1'
      this.theProjectLog = {
        project_code: row.code,
        action: '项目立项通过',
        action_remark: '项目:' + row.name +'立项申请通过，项目正式立项，请前去处理',
        role: '销售负责人',
        operator: this.name,
        to_person: row.seller + ',' + row.technical_director,
        to_id: row.id,
        content: ''
      }
      this.approveDialogVisible = true  //显示审批对话框
    },
    //技术总监审批销售总监驳回立项
    showDialogCreateReject(row) {
      this.theProject = row
      this.approveDialogTitle = '驳回立项对话框'
      this.approveStatus = '-1'
      this.theProjectLog = {
        project_code: row.code,
        action: '项目立项驳回',
        action_remark: '项目:' + row.name +'立项申请被驳回',
        role: '销售负责人',
        operator: this.name,
        to_person: row.seller,
        to_id: row.id,
        content: ''
      }
      this.approveDialogVisible = true  //显示审批对话框
    },

    //将项目表中状态改为设计立项或完成
    makeSureApprove() {
      this.approveDialogVisible = false
      this.theProjectLog.content = this.approveTextarea  //写入通过或驳回的意见
      fetch(process.env.VUE_APP_BASE_API + '/api/updateProjectStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/text',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify({
          project_code: this.theProject.code,
          status: this.approveStatus
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
        .then(() => {
          this.fetchAllProjectData()
          this.saveProjectLog(this.theProjectLog)//加一条项目日志
          this.approveTextarea = ''  //将内容框清空
          this.$message.success('操作成功')
        }).catch(error => {
        // 捕捉fetch过程中或处理响应时的错误
        console.error('Error:', error)
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

    //状态数字转文字
    statusToStr(row, column, cellValue, index) {
      if (cellValue === '0') {
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
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 500)
    },
    createStateFilter(queryString) {
      return (state) => {
        console.log(state)
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
      }
    },
    handleSelect(item) {
      this.activeName = 'five'
      this.about_all_my_projects = this.about_all_my_projects_bak.filter(p => p.code === item.code)
    },
    reset() {
      this.about_all_my_projects = this.about_all_my_projects_bak
      this.state = ''
    }
  },
  mounted() {
    this.fetchAllProjectData()
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
