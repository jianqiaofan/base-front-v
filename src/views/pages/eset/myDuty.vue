<template>
  <div class="dashboard-container">

    <div class="dashboard-text">{{ name }}，你好，欢迎登录 新恒源BOM报价系统 ！</div>

    <P></P>

    <el-divider></el-divider>

<!--    <div v-show="status1_list.length>0 && technical_director_list.includes(name)" class="div-badge" @click="handleBadgeClick1">-->
<!--      <el-badge :value="status1_list.length" class="item">-->
<!--        <el-button size="small">待指派任务</el-button>-->
<!--      </el-badge>-->
<!--    </div>-->

    <div class="div-badge" @click="handleBadgeClick2">
      <el-badge :value="status2_list.length" class="item">
        <el-button size="small">设计和报价中</el-button>
      </el-badge>
    </div>
    <div class="div-badge" @click="handleBadgeClick3">
      <el-badge :value="status3_list.length" class="item" type="primary">
        <el-button size="small">技术审核中</el-button>
      </el-badge>
    </div>
    <div class="div-badge" @click="handleBadgeClick4">
      <el-badge :value="status4_list.length" class="item" type="warning">
        <el-button size="small">已提交项目</el-button>
      </el-badge>
    </div>

    <el-dialog title="指派设计师" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="tbProject" :rules="rules" label-width="100px" size="small"
               style="padding-right: 40px;"
      >
        <el-form-item label="项目编号" prop="code">
          <el-input v-model="tbProject.code" disabled/>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="tbProject.name" disabled/>
        </el-form-item>
        <el-form-item label="项目所在地" prop="site">
          <el-input v-model="tbProject.site" disabled/>
        </el-form-item>
        <el-form-item label="销售经理" prop="seller">
          <el-input v-model="tbProject.seller" disabled/>
        </el-form-item>
        <el-form-item label="设计师">
          <el-select v-model="selectedDesigners" @change="selectDesigner" multiple placeholder="请选择">
            <el-option
              v-for="item in mydata.select_option.designer"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="指派任务" :visible.sync="dialogVisible1" width="60%" :close-on-click-modal="false">
      <el-table :data="status1_list" height="400" border style="width: 100%">
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="assignDesigner(scope.row.id)"
            >指 派
            </el-button>
            <!--            :disabled="$hasBP('bnt.tbProject.update')  === false"-->
          </template>
        </el-table-column>
        <el-table-column prop="code" label="项目编号" width="100"></el-table-column>
        <el-table-column prop="name" label="名称" min-width="200"></el-table-column>
        <el-table-column prop="site" label="项目所在地" width="100"></el-table-column>
        <el-table-column prop="designer" label="设计师" width="80"></el-table-column>
        <el-table-column prop="seller" label="销售经理" width="80"></el-table-column>
        <el-table-column prop="category" label="类别" width="100"></el-table-column>
<!--        <el-table-column prop="data_link" label="提交资料链接" width="200"></el-table-column>-->
        <el-table-column prop="data_link" label="提交资料链接" width="200">
          <template slot-scope="scope">
            <!-- 判断链接是否存在，如果存在则渲染 a 标签，否则显示“未提交” -->
            <a v-if="scope.row.data_link" :href="scope.row.data_link" target="_blank" style="color: #409EFF; text-decoration: none;">
              {{ scope.row.data_link|linkFilter(30) }}
            </a>
            <span v-else>未提交</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80"></el-table-column>
        <el-table-column prop="required_completion_time" label="要求完成时间" width="180"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>

      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
      </span>
    </el-dialog>


    <el-dialog title="设计和报价中" :visible.sync="dialogVisible2" width="60%" :close-on-click-modal="false">
      <el-table :data="status2_list" height="400" border style="width: 100%">
        <el-table-column prop="code" label="项目编号" width="100"></el-table-column>
        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column prop="site" label="项目所在地" width="100"></el-table-column>
        <el-table-column prop="designer" label="设计师" width="80"></el-table-column>
        <el-table-column prop="seller" label="销售经理" width="80"></el-table-column>
        <el-table-column prop="category" label="类别" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="80"></el-table-column>
        <el-table-column prop="updateTime" label="指派时间" width="180"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="180">
          <template slot-scope="scope">
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="方案审核中" :visible.sync="dialogVisible3" width="60%" :close-on-click-modal="false">
      <el-table :data="status3_list" height="400" border style="width: 100%">
        <el-table-column prop="code" label="项目编号" width="100"></el-table-column>
        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column prop="site" label="项目所在地" width="100"></el-table-column>
        <el-table-column prop="designer" label="设计师" width="80"></el-table-column>
        <el-table-column prop="seller" label="销售经理" width="80"></el-table-column>
        <el-table-column prop="category" label="类别" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="80"></el-table-column>
        <el-table-column prop="updateTime" label="提交时间" width="180"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="checkPass(scope.row.id)"
                       :disabled="$hasBP('bnt.tbProject.update')  === false"
            >通 过
            </el-button>
            <el-button type="warning" size="mini" @click="checkReject(scope.row.id)"
                       :disabled="$hasBP('bnt.tbProject.update')  === false"
            >退 回
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="方案审核中" :visible.sync="dialogVisible4" width="60%" :close-on-click-modal="false">
      <el-table :data="status4_list" height="400" border style="width: 100%">
        <el-table-column prop="code" label="项目编号" width="100"></el-table-column>
        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column prop="site" label="项目所在地" width="100"></el-table-column>
        <el-table-column prop="designer" label="设计师" width="80"></el-table-column>
        <el-table-column prop="seller" label="销售经理" width="80"></el-table-column>
        <el-table-column prop="category" label="类别" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="80"></el-table-column>
        <el-table-column prop="updateTime" label="批准时间" width="180"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4 = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import api from '@/api/eset/tbProject'
import { getToken } from '@/utils/auth'
import mydata from '@/api/eset/mydata'

const defaultForm = {}
export default {
  name: 'MyDuty',
  data() {
    return {
      selectedDesigners: [], // 用于存储选中的设计师
      technical_director_list: ['万龙波','王鹏飞','马骏'],
      listLoading: true, // 数据是否正在加载
      list: [], // banner列表
      status1_list: [],  //状态1列表内容
      status2_list: [],  //状态2列表内容
      status3_list: [],  //状态3列表内容
      status4_list: [],  //状态4列表内容
      status5_list: [],  //状态5列表内容
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10000, // 每页记录数
      searchObj: {}, // 查询表单对象
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      tbProject: defaultForm,
      saveBtnDisabled: false,
      rules: {},
      designers: []
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
  filters:{
    linkFilter(str,n){
      if(typeof str !== 'string'){
        return undefined
      } else {
        if(str.trim().slice(0,4) === 'http'){
          return str.slice(0,n)
        } else {
          return undefined
        }
      }
    }
  },
  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    this.fetchData()
  },
  methods: {

    selectDesigner(value) {
      // 当选中的设计师发生变化时，将其连接成一个字符串
      this.tbProject.designer = value.join(', ')
    },

    // 加载banner列表数据

    fetchData() {
      fetch(process.env.VUE_APP_BASE_API + '/api/findMyAboutProject', {
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
          this.list = r.data
          console.log("================",this.list)
          this.total = this.list.length
          this.status1_list = []
          this.status2_list = []
          this.status3_list = []
          this.status4_list = []
          this.status5_list = []
          for (let i = 0; i < this.total; i++) {
            if (this.list[i].status === '1') {
              this.status1_list.push(this.list[i])
            } else if (this.list[i].status === '2') {
              if (this.list[i].name !== '临时保存') {
                this.status2_list.push(this.list[i])
              }
            } else if (this.list[i].status === '3') {
              this.status3_list.push(this.list[i])
            } else if (this.list[i].status === '4') {
              this.status4_list.push(this.list[i])
            } else if (this.list[i].status === '5') {
              this.status5_list.push(this.list[i])
            }
          }
          this.listLoading = false
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })

    },

    //指定任务人编辑
    assignDesigner(id) {
      this.dialogVisible = true
      api.getById(id).then(response => {
        this.$nextTick(function() {
          this.tbProject = response.data
          this.tbProject.status = this.tbProject.status * 1 + 1
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

    //更新
    update() {
      api.updateById(this.tbProject).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.dialogVisible1 = false
        this.dialogVisible2 = false
        this.dialogVisible3 = false
        this.dialogVisible4 = false
        this.fetchData(this.page)
      })
    },

    handleBadgeClick1(event) {
      this.dialogVisible1 = true
    },
    handleBadgeClick2(event) {
      this.dialogVisible2 = true
    },
    handleBadgeClick3(event) {
      this.dialogVisible3 = true
    },
    handleBadgeClick4(event) {
      this.dialogVisible4 = true
    },

    //提交审核

    // 根据id删除数据
    submitCheck(id) {
      // debugger
      this.$confirm('此操作将提交项目到下一步, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        this.tbProject.id = id
        this.tbProject.status = 3  //状态加1
        return api.updateStatusById(this.tbProject)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '提交成功')
        this.dialogVisible = false
        this.dialogVisible1 = false
        this.dialogVisible2 = false
        this.dialogVisible3 = false
        this.dialogVisible4 = false
      }).catch(() => {
        this.$message.info('取消提交')
      })
    },

    submitRevoke(id) {
      // debugger
      this.$confirm('此操作将撤回已提交项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        this.tbProject.id = id
        this.tbProject.status = 2  //状态减1
        return api.updateStatusById(this.tbProject)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '撤回成功')
      }).catch(() => {
        this.$message.info('取消撤回')
      })
    },

    checkPass(id) {
      // debugger
      this.$confirm('此操作将确认项目审核确认通过并转到到下一步, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        this.tbProject.id = id
        this.tbProject.status = 4  //状态加1
        return api.updateStatusById(this.tbProject)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '确认成功')
        this.dialogVisible = false
        this.dialogVisible1 = false
        this.dialogVisible2 = false
        this.dialogVisible3 = false
        this.dialogVisible4 = false
      }).catch(() => {
        this.$message.info('取消确认')
      })
    },

    checkReject(id) {
      alert(id)
      // debugger
      this.$confirm('此操作驳回当前审核的项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        this.tbProject.id = id
        this.tbProject.status = 2  //状态减1
        return api.updateStatusById(this.tbProject)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '驳回成功')
        this.dialogVisible = false
        this.dialogVisible1 = false
        this.dialogVisible2 = false
        this.dialogVisible3 = false
        this.dialogVisible4 = false
      }).catch(() => {
        this.$message.info('驳回提交')
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  max-width: 100%; /* 限制容器宽度不超过屏幕宽度 */
  overflow-x: auto; /* 当内容宽度超过容器宽度时显示水平滚动条 */
}

.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

table {
  width: 1200px;
  margin-left: 60px;
  border-collapse: collapse; /* 确保边框不会重叠 */
  border: 1px solid black; /* 设置表格边框颜色和宽度 */
}

th, td {
  border: 1px solid black; /* 设置表格内部单元格边框颜色和宽度 */
  text-align: center;
}

caption {
  text-align: left;
  height: 40px;
}

a {
  text-decoration: underline; /* 添加下划线 */
  color: blue; /* 设置文字颜色为蓝色 */
}

.item {
  margin-top: 10px;
  margin-right: 30px;
}

.div-badge {
  display: inline;
}

</style>
