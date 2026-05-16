<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="工作内容">
              <el-input v-model="searchObj.name" placeholder="工作内容" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">
              <el-input v-model="searchObj.remark" placeholder="项目名称" clearable/>
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
                 :disabled="$hasBP('bnt.tbWorkLog.add')  === false"
      >添 加
      </el-button>
      <el-button style="margin-left:8px" size="mini" :disabled="$hasBP('bnt.tbWorkLog.list')  === false" type="primary"
                 @click="exportData"
      >导出数据
      </el-button>
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
      <el-table-column sortable prop="workDate" label="日期" width="100px"/>
      <el-table-column sortable prop="contentText" label="工作内容" min-width="200px"/>
      <el-table-column sortable prop="projectName" label="服务项目" min-width="200px"/>
      <el-table-column prop="workHours" label="工作时长"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column type="expand" label="...">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="记录人">
              <span>{{ props.row.recorder }}</span>
            </el-form-item>
            <el-form-item label="日期">
              <span>{{ props.row.workDate }}</span>
            </el-form-item>
            <el-form-item label="工作内容">
              <span>{{ props.row.content }}</span>
            </el-form-item>
            <el-form-item label="服务项目">
              <span>{{ props.row.projectCode }}</span>
            </el-form-item>
            <el-form-item label="工作内容">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
            <el-form-item label="工作时长">
              <span>{{ props.row.workHours }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
            <el-form-item label="修改时间">
              <span>{{ props.row.updateTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)"
                     :disabled="$hasBP('bnt.tbWorkLog.update')  === false" title="修改"
          />
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)"
                     :disabled="$hasBP('bnt.tbWorkLog.remove')  === false" title="删除"
          />
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
    <el-dialog title="添加/修改工作日志" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="tbWorkLog" :rules="rules" label-width="100px" size="small"
               style="padding-right: 40px;"
      >
        <el-form-item label="记录人" prop="recorder" placeholder="默认为本人" hidden="hidden">
          <el-input v-model="tbWorkLog.recorder" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="工作日期" prop="workDate">
<!--          <el-input v-model="tbWorkLog.workDate" clearable/>-->
          <el-date-picker
            v-model="tbWorkLog.workDate"
            align="right"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="工作内容" prop="content">
          <el-select v-model="tbWorkLog.content" style="width: 100%" placeholder="Please select the work content">
            <el-option v-for="option in contentOptions" :key="option.value" :label="option.label" :value="option.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!--          <el-input v-model="tbWorkLog.content" clearable/>-->
<!--        <el-form-item label="工作时长" prop="workHours">-->
<!--          <el-input v-model="tbWorkLog.workHours" clearable/>-->
<!--        </el-form-item>-->
        <el-form-item label="工作时长" prop="workHours">
          <el-select v-model="onHours" placeholder="Please select">
            <el-option v-for="option in onHoursOptions" :key="option.value" :label="option.label" :value="option.value">
            </el-option>
          </el-select>
          +
          <el-select v-model="halfHours" placeholder="Please select">
            <el-option v-for="option in halfHoursOptions" :key="option.value" :label="option.label" :value="option.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="服务项目" prop="workHours">
          <el-select v-model="tbWorkLog.projectCode"  style="width: 100%" placeholder="Please select">
            <el-option v-for="option in projectOptions" :key="option.value" :label="option.label" :value="option.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6}"
            placeholder="请输入内容,比如遇到的问题、获得的心得以及需要领导或其它同事协助的事宜(1000字以内)"
            v-model="tbWorkLog.remark">
          </el-input>
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
import { mapGetters } from 'vuex'
import api from '@/api/eset/tbWorkLog'
import { getToken } from '@/utils/auth'

const defaultForm = {}
export default {
  components: {},
  data() {
    return {
      contentOptions: [
        { label: '==========技术支持==========', value: '100' },
        { label: '查阅、研究提资资料', value: '101' },
        { label: '与销售经理、业主方线上或线下沟通', value: '102' },
        { label: '与销售经理、业主方线上或线下会议沟通的', value: '103' },
        { label: '结构方案设计与计算', value: '104' },
        { label: '编制结构计算书', value: '105' },
        { label: '计算报价，制作Bom表单', value: '106' },
        { label: '桩基计算', value: '107' },
        { label: 'POT计算', value: '108' },
        { label: '编制桩基基础报告', value: '109' },
        { label: '检查、审核或审批他人工作成果', value: '110' },
        { label: '==========学习与研发==========', value: '200' },
        { label: '研究提高工作效率的方法或工具', value: '201' },
        { label: '研究提升产品功能、质量，或降低产品成本', value: '202' },
        { label: '编写专利、软著、论文', value: '203' },
        { label: '参与公司或部门安排的培训、考试等', value: '204' },
        { label: '学习规范、软件及产品相关知识', value: '205' },
        { label: '==========其它==========', value: '900' },
        { label: '出差，在路途中或交通工具上的时间', value: '901' },
        { label: '参加公司或部门组织的会议', value: '902' },
        { label: '公司或部门团建', value: '903' },
        { label: '财务报销', value: '904' },
        { label: '其它', value: '999' },
      ],
      onHours:0,
      halfHours:0,
      onHoursOptions:[
        { label: '0.0 hour', value: '0' },
        { label: '1.0 hour', value: '1' },
        { label: '2.0 hour', value: '2' },
        { label: '3.0 hour', value: '3' },
        { label: '4.0 hour', value: '4' },
        { label: '5.0 hour', value: '5' },
        { label: '6.0 hour', value: '6' },
        { label: '7.0 hour', value: '7' },
        { label: '8.0 hour', value: '8' },
        { label: '9.0 hour', value: '9' },
        { label: '10.0 hour', value: '10' },
        { label: '11.0 hour', value: '11' },
        { label: '12.0 hour', value: '12' },
        { label: '13.0 hour', value: '13' },
        { label: '14.0 hour', value: '14' },
      ],
      halfHoursOptions:[
        { label: '0.0 hour', value: '0' },
        { label: '0.5 hour', value: '0.5' },
      ],
      projectOptions:[
        { value: '0', label: '无' },
        { value: '2026-001', label: 'Hanningfield' },
        { value: '2026-002', label: 'SPPC- Solar PV Plants 3.1 GW -Round 7 - Alfanar' },
        { value: '2026-003', label: '沙特PIF7 AHK3、KSH2-（能建国际+中南院+浙江火电）' },
        { value: '2026-004', label: '能建国际+广火+中南院，DEWA7' },
        { value: '2026-005', label: '巴林逆变器防晒棚' },
        { value: '2026-006', label: 'IRN Ardabil 22MW Project' },
        { value: '2026-007', label: '能建国际+浙火+中南院，科威特1.1GWac Al Shagaya Phase I' },
        { value: '2026-008', label: 'ROM MEATPROD' },
        { value: '2026-009', label: 'Zambrano 1' },
        { value: '2026-010', label: '20MW Lupao Solar Power Plant' },
        { value: '2026-011', label: '35 MWp - Grond Mount System' },
        { value: '2026-012', label: 'La Esperanza' },
        { value: '2026-013', label: '华东院津巴58MW跟踪' },
        { value: '2026-014', label: '老挝MKP 75MW+7.5MW+7.5MW跟踪支架' },
        { value: '2026-015', label: '老挝75MWDC固定支架' },
        { value: '2026-016', label: 'REPLAN' },
        { value: '2026-017', label: 'S&W_150 MW KCM Zambia project' },
        { value: '2026-018', label: '能建华东院罗马尼亚154MW(AC)跟踪支架' },
        { value: '2026-019', label: 'Sabah-14.99 (Kimanis)' },
        { value: '2026-020', label: 'Bayambang SPP' },
        { value: '2026-021', label: '沙特PIF7&8 ，贵州电建' },
        { value: '2026-022', label: '能建西南院印尼227MW固定支架' },

      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '前天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
            picker.$emit('pick', date);
          }
        }]
      },
      listLoading: true, // 数据是否正在加载
      list: [], // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 50, // 每页记录数
      searchObj: {}, // 查询表单对象
      dialogVisible: false,
      tbWorkLog: defaultForm,
      saveBtnDisabled: false,
      selectValue: [] //复选框选择内容封装数组
      , rules: {
        name:
          [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),

    contentObj(){
      let obj = {}
      this.contentOptions.forEach(o=>{
        obj[o.value] = o.label
      })
      return obj
    },
    projectObj(){
      let obj = {}
      this.projectOptions.forEach(o=>{
        obj[o.value] = o.label
      })
      return obj
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
      window.open(process.env.VUE_APP_BASE_API + '/eset/tbWorkLog/export?token=' + getToken())
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
          this.list.forEach(o=>{
            if(o.projectCode in this.projectObj){
              o.projectName = this.projectObj[o.projectCode ]
            }
            else{
              o.projectName = o.projectCode
            }
            if(o.content in this.contentObj){
              o.contentText = this.contentObj[o.content ]
            }
            else{
              o.contentText = o.content
            }
          })

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
      this.tbWorkLog = {}
      this.rules.name = [{ required: true, message: '请输入名称', trigger: 'blur' }]
    },
    //编辑
    edit(id) {
      this.dialogVisible = true
      this.rules.name = [{ required: true, message: '请输入名称', trigger: 'blur' }]
      api.getById(id).then(response => {
        this.$nextTick(function() {
          this.tbWorkLog = response.data
          if (this.$refs.zdept) {
            this.$refs.zdept.reset_data(this.tbWorkLog.deptName)
          }
          if (this.$refs.eltreeDept) {
            this.$refs.eltreeDept.setCheckedKeys(this.tbWorkLog.deptIdList)
          }
        })
      })
    },
    //添加或更新
    saveOrUpdate() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          if (!this.tbWorkLog.id) {
            this.save()
          } else {
            this.update()
          }
        }
      })
    },
    //添加
    save() {
      console.log("this.tbWorkLog",this.tbWorkLog.workDate)
      this.tbWorkLog.recorder = this.name
      this.tbWorkLog.workHours = 1*this.onHours + 1*this.halfHours


      api.save(this.tbWorkLog).then(response => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },
    //更新
    update() {
      api.updateById(this.tbWorkLog).then(response => {
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
