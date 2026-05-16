<template>
  <div class="app-container">
    <div>
      <ProjectCharts1></ProjectCharts1>
    </div>
    <el-divider></el-divider>
    <div class="search-div">
      <el-form label-width="100px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目名称">
              <el-input v-model="searchObj.projectName" placeholder="项目名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设计师">
              <el-input v-model="searchObj.designer" placeholder="设计师" clearable/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add"
                 :disabled="$hasBP('bnt.tbProjectTechnical.add')  === false"
      >添 加
      </el-button>
<!--      <el-button class="btn-add" size="mini" @click="batchRemove()" :disabled="$hasBP('bnt.tbProjectTechnical.remove')  === false">-->
<!--        批量删除-->
<!--      </el-button>-->
<!--      <el-button style="margin-left:8px" size="mini" :disabled="$hasBP('bnt.tbProjectTechnical.list')  === false" type="primary"-->
<!--                 @click="exportData"-->
<!--      >导出数据-->
<!--      </el-button>-->
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      :row-key="getRowKeys"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="序号"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="projectCode" label="项目号" width="80px"/>
      <el-table-column sortable prop="projectName" label="项目名称" width="260px"/>
      <el-table-column sortable prop="site" label="项目地"/>
      <el-table-column sortable prop="status" label="状态"/>
      <el-table-column sortable prop="category" label="项目类别"/>
      <el-table-column sortable prop="seller" label="销售经理"/>
      <el-table-column sortable prop="designer" label="设计师"/>
<!--      <el-table-column sortable prop="checker" label="校对人"/>-->
<!--      <el-table-column sortable prop="technicalDirector" label="技术负责人"/>-->
      <el-table-column sortable prop="designFinishedDate" label="设计开始时间"/>
<!--      <el-table-column sortable prop="designFinishedDate" label="设计结束时间"/>-->
<!--      <el-table-column sortable prop="windSpeedLocal" label="风速类别"/>-->
      <el-table-column prop="windSpeed" label="风速"/>
      <el-table-column prop="meanRecurrenceInterval" label="重现期"/>
<!--      <el-table-column sortable prop="moduleLayout" label="组件排布"/>-->
      <el-table-column prop="moduleDimension" label="组件尺寸"/>
      <el-table-column prop="modulePower" label="单组件容量"/>
      <el-table-column prop="groundClearence" label="最小离地高度"/>
<!--      <el-table-column sortable prop="embedment" label="埋入方式"/>-->
      <el-table-column prop="capacityMw" label="容量" width="100px"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column type="expand" label="...">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="项目号"><span>{{ props.row.projectCode }}</span></el-form-item>
            <el-form-item label="项目名称"><span>{{ props.row.projectName }}</span></el-form-item>
            <el-form-item label="项目地"><span>{{ props.row.site }}</span></el-form-item>
            <el-form-item label="状态"><span>{{ props.row.status }}</span></el-form-item>
            <el-form-item label="项目类别"><span>{{ props.row.category }}</span></el-form-item>
            <el-form-item label="销售经理"><span>{{ props.row.seller }}</span></el-form-item>
            <el-form-item label="设计师"><span>{{ props.row.designer }}</span></el-form-item>
            <el-form-item label="校对人"><span>{{ props.row.checker }}</span></el-form-item>
            <el-form-item label="技术负责人"><span>{{ props.row.technicalDirector }}</span></el-form-item>
            <el-form-item label="设计开始时间"><span>{{ props.row.designFinishedDate }}</span></el-form-item>
            <el-form-item label="设计结束时间"><span>{{ props.row.designFinishedDate }}</span></el-form-item>
            <el-form-item label="风速类别"><span>{{ props.row.windSpeedLocal }}</span></el-form-item>
            <el-form-item label="风速"><span>{{ props.row.windSpeed }}</span></el-form-item>
            <el-form-item label="重现期"><span>{{ props.row.meanRecurrenceInterval }}</span></el-form-item>
            <el-form-item label="组件排布"><span>{{ props.row.moduleLayout }}</span></el-form-item>
            <el-form-item label="组件尺寸"><span>{{ props.row.moduleDimension }}</span></el-form-item>
            <el-form-item label="单组件容量"><span>{{ props.row.modulePower }}</span></el-form-item>
            <el-form-item label="最小离地高度"><span>{{ props.row.groundClearence }}</span></el-form-item>
            <el-form-item label="埋入方式"><span>{{ props.row.embedment }}</span></el-form-item>
            <el-form-item label="容量(兆瓦)"><span>{{ props.row.capacityMw }}</span></el-form-item>
            <el-form-item label="备注"><span>{{ props.row.remark }}</span></el-form-item>
            <el-form-item label="创建时间"><span>{{ props.row.createTime }}</span></el-form-item>
            <el-form-item label="修改时间"><span>{{ props.row.updateTime }}</span></el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)"
                     :disabled="$hasBP('bnt.tbProjectTechnical.update')  === false" title="修改"
          />
<!--          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)"-->
<!--                     :disabled="$hasBP('bnt.tbProjectTechnical.remove')  === false" title="删除"-->
<!--          />-->
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
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="tbProjectTechnical" :rules="rules" label-width="160px" size="small"
               style="padding-right: 40px;"
      >
        <el-form-item label="项目号" prop="projectCode">
          <el-input v-model="tbProjectTechnical.projectCode"/>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="tbProjectTechnical.projectName"/>
        </el-form-item>

        <el-form-item label="类别" prop="category">
          <el-select v-model="tbProjectTechnical.category" placeholder="Please select the category ">
            <el-option v-for="option in mydata.select_option.category" :key="option.value" :label="option.label" :value="option.value">
            </el-option>
          </el-select>&nbsp;
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="tbProjectTechnical.status" placeholder="Please select the status ">
            <el-option v-for="option in statusOptions" :key="option.value" :label="option.label" :value="option.value">
            </el-option>
          </el-select>&nbsp;
        </el-form-item>
        <el-form-item label="项目地" prop="site">
          <el-input v-model="tbProjectTechnical.site"/>
        </el-form-item>
        <el-form-item label="设计师" prop="designer">
          <el-input v-model="tbProjectTechnical.designer"/>
        </el-form-item>
        <el-form-item label="销售经理" prop="seller">
          <el-input v-model="tbProjectTechnical.seller"/>
        </el-form-item>
        <el-form-item label="校核人" prop="checker">
          <el-input v-model="tbProjectTechnical.checker"/>
        </el-form-item>
        <el-form-item label="技术负责" prop="technicalDirector">
          <el-select v-model="tbProjectTechnical.technicalDirector" placeholder="Please select the technical director ">
            <el-option v-for="option in technicalDirectorOptions" :key="option.value" :label="option.label" :value="option.value">
            </el-option>
          </el-select>&nbsp;
        </el-form-item>
        <el-form-item label="设计开始时间" prop="designFinishedDate">
          <el-input v-model="tbProjectTechnical.designFinishedDate"/>
        </el-form-item>
        <el-form-item label="设计结束时间" prop="designFinishedDate">
          <el-input v-model="tbProjectTechnical.designFinishedDate"/>
        </el-form-item>
        <el-form-item label="风速类别" prop="windSpeedLocal">
          <el-select v-model="tbProjectTechnical.windSpeedLocal" placeholder="Please select the wind speed local ">
            <el-option v-for="option in windSpeedLocalOptions" :key="option.value" :label="option.label" :value="option.value">
            </el-option>
          </el-select>&nbsp;
        </el-form-item>
        <el-form-item label="风速风压" prop="windSpeed">
          <el-input v-model="tbProjectTechnical.windSpeed"/>
        </el-form-item>
        <el-form-item label="重现期" prop="meanRecurrenceInterval">
          <el-select v-model="tbProjectTechnical.meanRecurrenceInterval" placeholder="Please select the mean recurrence interval ">
            <el-option v-for="option in meanRecurrenceIntervalOptions" :key="option.value" :label="option.label" :value="option.value">
            </el-option>
          </el-select>&nbsp;
        </el-form-item>
        <el-form-item label="组件排布" prop="moduleLayout">
          <el-input v-model="tbProjectTechnical.moduleLayout" />
        </el-form-item>
        <el-form-item label="组件尺寸" prop="moduleDimension">
          <el-input v-model="tbProjectTechnical.moduleDimension" />
        </el-form-item>
        <el-form-item label="单组件容量" prop="modulePower">
          <el-input v-model="tbProjectTechnical.modulePower" />
        </el-form-item>
        <el-form-item label="最小离地高度(mm)" prop="groundClearence">
          <el-input v-model="tbProjectTechnical.groundClearence" />
        </el-form-item>
        <el-form-item label="埋入方式" prop="embedment">
          <el-select v-model="tbProjectTechnical.embedment" placeholder="Please select the embedment ">
            <el-option v-for="option in embedmentOptions" :key="option.value" :label="option.label" :value="option.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="总容量(Mw)" prop="capacityMw">
          <el-input v-model="tbProjectTechnical.capacityMw" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="tbProjectTechnical.remark" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import api from '@/api/eset/tbProjectTechnical'
import ProjectCharts1 from '@/views/pages/eset/mycharts/projectCharts1.vue'
import mydata from '@/api/eset/mydata'

const defaultForm = {}
export default {
  components: {ProjectCharts1},
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: [], // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 50, // 每页记录数
      searchObj: {}, // 查询表单对象
      dialogVisible: false,
      tbProjectTechnical: defaultForm,
      saveBtnDisabled: false,
      selectValue: [],//复选框选择内容封装数组
      rules: {
        projectCode:{ required: true, message: '项目号 必填', trigger: 'blur' },
        projectName:{ required: true, message: '项目名称 必填', trigger: 'blur' },
        site:{ required: true, message: '项目所在地 必填,国际项目填写国家,国内项目精确到市', trigger: 'blur' },
        designer:{ required: true, message: '设计师 必填,当多人合作设计时,名字之间用逗号(,)或斜杠(/)隔开', trigger: 'blur' },
        seller:{ required: true, message: '项目总容量 必填 单位为兆瓦', trigger: 'blur' },
        designFinishedDate:{ required: true, message: '设计开始日期 必填 格式为"2025-mm-dd"', trigger: 'blur' },
        capacityMw:{ required: true, message: '项目总容量 必填', trigger: 'blur' },
        moduleDimension:{ required: false, message: '组件尺寸 请参考格式"2465X1134X30",当有多个时，请用逗号(,)或斜杠(/)隔开', trigger: 'blur' },
      },
      windSpeedLocalOptions:[
        {label: '3s gust', value: '3s gust'},
        {label: '10 min', value: '10 min'},
        {label: '1h', value: '1h'},
      ],
      statusOptions:[
        {label: '(完成)Closed', value: 'Closed'},
        {label: '(进行中)WIP', value: 'WIP'},
        {label: '(未定)Open', value: 'Open'},
        {label: '(重做)Repeat', value: 'Repeat'},
        {label: '(挂起)Suspend', value: 'Suspend'},
        {label: '(中标)Success', value: 'Success'},
      ],
      meanRecurrenceIntervalOptions:[
        {label: '50 Year', value: '50 Year'},
        {label: '300 Year', value: '300 Year'},
        {label: '700 Year', value: '700 Year'},
        {label: '1700 Year', value: '1700 Year'}
      ],
      embedmentOptions:[
        {label: 'Ramming pile', value: 'Ramming pile'},
        {label: 'Concrete', value: 'Concrete'},
        {label: 'Pipe pile', value: 'Pipe pile'},
        {label: 'PHC pile', value: 'PHC pile'},
        {label: 'Screw pile', value: 'Screw pile'},
        {label: 'Other Foundation', value: 'Other Foundation'}
      ],
      technicalDirectorOptions:[
        {label: '万龙波', value: '万龙波'},
        {label: '王鹏飞', value: '王鹏飞'},
        {label: '马骏', value: '马骏'}
      ],

    }
  },
  computed:{
    mydata() {
      return mydata
    },
  },
  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    console.log('list created......')
    this.fetchData()
  },
  // 生命周期函数：内存准备完毕，页面渲染成功
  mounted() {
    console.log('list mounted......')
  },
  methods: {
    getRowKeys(row) {
      return row.id
    },
    //导出数据
    exportData() {
      window.open(process.env.VUE_APP_BASE_API + '/eset/tbProjectTechnical/export?token=' + getToken())
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
      api.getPageList(this.page, this.limit, this.searchObj).then(
        response => {
          //this.list = response.data.list
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
    // 根据id删除数据
    removeDataById(id) {
      // debugger
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return api.removeById(id)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '删除成功')
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    //复选框发生变化执行方法
    handleSelectionChange(selection) {
      this.selectValue = selection
      //console.log(this.selectValue)
    },
    //批量删除
    batchRemove() {
      //判断
      if (this.selectValue.length == 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //数组
        var idList = []
        //获取多个复选框对应id，封装到数组里面
        // [1,2,3]
        for (var i = 0; i < this.selectValue.length; i++) {
          var obj = this.selectValue[i]
          //id值
          var id = obj.id
          //放到数组里面
          idList.push(id)
        }
        api.batchRemove(idList).then(response => {
          //提示
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          //刷新
          this.fetchData()
        })
      })
    },
    //弹出添加表单
    add(row) {
      this.dialogVisible = true
      if (this.$refs.zdept) {
        this.$refs.zdept.reset_data()
      }
      this.tbProjectTechnical = {}
      this.rules.name = [{ required: true, message: '请输入名称', trigger: 'blur' }]
    },
    //编辑
    edit(id) {
      this.dialogVisible = true
      this.rules.name = [{ required: true, message: '请输入名称', trigger: 'blur' }]
      api.getById(id).then(response => {
        this.$nextTick(function() {
          this.tbProjectTechnical = response.data
          if (this.$refs.zdept) {
            this.$refs.zdept.reset_data(this.tbProjectTechnical.deptName)
          }
          if (this.$refs.eltreeDept) {
            this.$refs.eltreeDept.setCheckedKeys(this.tbProjectTechnical.deptIdList)
          }
        })
      })
    },
    //添加或更新
    saveOrUpdate() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          if (!this.tbProjectTechnical.id) {
            this.save()
          } else {
            this.update()
          }
        }
      })
    },
    //添加
    save() {
      api.save(this.tbProjectTechnical).then(response => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },
    //更新
    update() {
      api.updateById(this.tbProjectTechnical).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
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
</style>
