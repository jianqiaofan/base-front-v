<template>
  <div class="test-container scrollable-div">
    <div v-if="modifiable">
      <input type="file" @change="loadExcel"/>
      <el-divider></el-divider>
    </div>

    <div class="item">
      <el-alert
        class="el-icon-chat-dot-round"
        title="项目编号|项目名称|方案名称|版本号"
        type="warning"
        :closable="false"
        style="margin: 10px 0"
      >
        <div class="content">
          {{ planInfo.project_code }}|{{ planInfo.project_name }}|{{ planInfo.plan_description }}|第{{ planInfo.design_version }}版
        </div>
      </el-alert>
    </div>

    <el-divider></el-divider>
    <div v-if="bomindex === 2" class="header-info">
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <div class="info-content">材料报价标准钢厂：</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <div class="info-content">包装标准：新恒源包装方案</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <div class="info-content">海运费：</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <div class="info-content">项目调试调机费用：</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <div class="info-content">卸车工具：</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <div class="info-content">发货地：天津</div>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button @click="open1" size="medium">报价需求信息</el-button>
<!--          <el-button @click="open1" size="mini">快速输入</el-button>-->
        </el-col>
      </el-row>
    </div>

    <div style="height: 50px"></div>


    <el-tabs>
      <el-tab-pane v-for="bom in structureBoms" :label="bom.sheetName">
        <ExcelBom1 v-if="bomindex === 1" :objBom="bom"></ExcelBom1>
        <ExcelBom2 v-if="bomindex === 2" :objBom="bom"></ExcelBom2>
      </el-tab-pane>
    </el-tabs>

    <div v-show="saveable && this.structureBoms.length>0">
      <el-divider></el-divider>
      <el-row>
        <el-button type="warning" @click="savePlan">保存方案</el-button>
      </el-row>
    </div>

    <!--    选择要导入工作表对话框-->
    <el-dialog
      title="请选择要导入的工作表"
      :visible.sync="chooseWorksheetDialogVisible"
      width="30%"
      left
    >
      <div v-for="item in options_worksheet">
        <el-checkbox v-model="worksheetsChoice" :label="item"></el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseWorksheetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="readExcel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import myExcel from '@/api/eset/myExcel.js'
import { ProjectBom } from '@/api/eset/ClassProjectBom.js'
import ExcelBom1 from '@/components/ExcelBom/Bom1'
import ExcelBom2 from '@/components/ExcelBom/Bom2'
import { getToken } from '@/utils/auth'

export default {
  name: 'tbImportBom',
  components: { ExcelBom1, ExcelBom2 },
  data() {
    return {
      planInfo: {},  //当前操作的方案对象(含有项目信息)
      workbook: {}, //excel文件对象
      structureBoms: [],//支架结构Boms工作表对对象

      //选择工作表
      worksheetsChoice: [],
      options_worksheet: [],
      chooseWorksheetDialogVisible: false
    }
  },
  methods: {
    open1() {
      const ms = '<strong>客户方：</strong>国外填所属国家/国内填提供所属集团公司<br>' +
        '<strong>项目地/港口：</strong>支架安装所属地，会影响包装费用<br>' +
        '<strong>项目批次：</strong>是整体项目还是批次项目/批次项目后续是否还有/投<br>' +
        '<strong>项目竞争对手：</strong>中信博/清源/PVH同时在投标<br>' +
        '<strong>设计员：</strong>范建桥<br>' +
        '<strong>防腐镀锌要求：</strong>平均65um/最低85um/275g/m2<br>' +
        '<strong>公差要求：</strong>例：国内公差标准<br>' +
        '<strong>包装要求：</strong>例：新恒源标准包装<br>' +
        '<strong>客户特殊要求：</strong>例：指定首钢/酒钢/宝钢/无要求或镀锌后喷富锌漆处理/欧标<br>' +
        '<strong>价格交付条款：</strong>例：EXW  天津工厂 板车  自提  /FOB  青岛港40HQ集装箱交付/ CIF  马尼拉  40HQ港口交付<br>' +
        '<strong>支付条款：</strong>买卖双方在合同中约定的货款支付方式和时间(T/T、L/C、D/P、D/A、B/G)<br>'
      this.$notify({
        title: '报价信息',
        dangerouslyUseHTMLString: true,
        message: ms
      })
    },
    test() {
      let d = Date.now()
    },
    async loadExcel(event) {
      await myExcel.getWorkbook(event.target.files[0]).then(item => {
        this.workbook = item
      })
      this.options_worksheet = myExcel.getExcelWorksheetNames(this.workbook)
      this.chooseWorksheetDialogVisible = true
    },
    readExcel() {
      if (!this.worksheetsChoice) {
        return
      } else {
        this.structureBoms = []
        this.worksheetsChoice.forEach(item => {
          let sheet = myExcel.getSheetObj(this.workbook, item)
          try {
            let a = new ProjectBom(sheet)
            this.structureBoms.push(a)
          } catch (e) {
            console.log(e)
          }
        })
      }
      this.chooseWorksheetDialogVisible = false
    },
    savePlan() {
      let subData = {
        plan_code: this.planCode,
        bomsNum: this.structureBoms.length,
        bomsData: this.structureBoms,
        saveTime: Date.now()
      }
      this.updatePlan(subData)
    },
    //保存方案
    updatePlan(subData) {
      fetch(process.env.VUE_APP_BASE_API + '/api/submitUpdatePlan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify(subData)
      })
        .then(response => {
          // 确保服务器响应为成功状态码
          if (response.ok) {
            // 获取响应体中的JSON数据
            alert('保存项目方案成功!')
            this.dialogVisible = false
            return response.json()
          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
        .then(r => {

        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },

    fetchPlanData() {
      fetch(process.env.VUE_APP_BASE_API + '/api/getProjectAndPlanByPlancodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: this.planCode
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
          console.log(r.data)
          if (r.data.length > 0) {
            this.planInfo = r.data[0]
            if (this.planInfo.tracker_info_num > 0) {
              this.fetchPlanDetailData()  //如果之前有方案，则加载方案
            }
          }
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },
    fetchPlanDetailData() {
      fetch(process.env.VUE_APP_BASE_API + '/api/findPlanDetail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: this.planCode
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
          let planObj = JSON.parse(r.data)
          this.structureBoms = planObj.bomsData
          console.log('planObj', planObj)

        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    }
  },
  props: {
    planCode: {
      type: String,
      require: false
    },
    saveable: {
      type: Boolean,  //是否可保存
      default: false
    },
    modifiable: {
      type: Boolean,  //是否可修改导入的Excel
      default: false
    },
    bomindex: {
      type: Number,  //显示Bom表各类1-技术导入(无价格);2-报价员可输入
      require: true
    }
  },
  mounted() {
    console.log(this.planCode)
    this.fetchPlanData()
  }
}
</script>

<style scoped>
.test-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 20px;
  max-width: 100%; /* 限制容器宽度不超过屏幕宽度 */
  overflow-x: auto; /* 当内容宽度超过容器宽度时显示水平滚动条 */
}

.scrollable-div {
  height: 1260px;
  padding-left: 20px;
  padding-bottom: 1200px;
  overflow-y: scroll;
}

.header-info {
  font-size: 30px;
  max-width: 1200px;
  height: 60px;
}

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
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

.info-content {
  font-size: 14px;
  line-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}


</style>







