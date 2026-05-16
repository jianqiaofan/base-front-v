<template>
  <div id="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
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

  </div>


</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import ProjectManagement from '@/views/pages/eset/trackers2/ProjectManagement.vue'
import mydata from '@/api/eset/mydata'

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
      activeName: 'third',
      about_all_my_projects: [],
      about_my_projects_designing: [],  //正在设计中的项目
      about_my_projects_selling: [],  //销售正在处理的项目
      about_my_projects_finished: [],  //已完成的项目
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    //跟单员只跟欧洲和拉美的项目
    mysite(){
      let t = mydata.select_option.optionsMap
      let m =[
        ...t.western_europe,
        ...t.nordic,
        ...t.central_europe,
        ...t.eastern_europe,
        ...t.southern_europe,
        ...t.europe_other,
        ...t.central_america,
        ...t.south_america,
        ...t.caribbean_region
      ]
     return m.filter(item => item !== undefined && item !== null && item !== '')
      .map(item => item.replace('(', '').replace(')', ''))
    },
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
    //获取全部项目信息和编号
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
          console.log('this.mysite:', this.mysite)
          this.about_all_my_projects = JSON.parse(JSON.stringify(r.data.filter(p => ['3','4'].includes(p.status) && p.site !== null && p.site !== undefined && this.mysite.includes(p.site.replace('(', '').replace(')', '')))))
          this.about_all_my_projects_bak = JSON.parse(JSON.stringify(this.about_all_my_projects))
          this.restaurants = []
          this.about_all_my_projects.forEach(item => {
            let s = `${item.code}|${item.name}|${item.seller}|${item.designer}|${item.geotechnical}`.replaceAll('null', '')
            this.restaurants.push({ value: s, code: item.code })
          })
          this.about_my_projects_selling = r.data.filter(p => p.status === '3' && this.mysite.includes(p.site))
          this.about_my_projects_finished = r.data.filter(p => p.status === '4' && this.mysite.includes(p.site))
          this.listLoading = false
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
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
