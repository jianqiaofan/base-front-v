<template>
  <div id="container">
    <h2>{{ name }}，你好，欢迎登录 新恒源BOM报价系统，请审核价格 ！</h2>
    <el-divider></el-divider>

    <div v-if="my_projects.length > 0 ">
      <table style="width: 1000px">
        <thead>
        <tr>
          <td style="width: 60px">序号</td>
          <td style="width: 180px">项目名称</td>
          <td style="width: 100px">项目编号</td>
          <td style="width: 260px">方案名称</td>
          <td style="width: 100px">设计师</td>
          <td style="width: 100px">校核人</td>
          <td style="width: 100px">方案状态</td>
          <td style="width: 160px">价格审查</td>
          <td style="width: 160px">操作</td>
        </tr>
        </thead>
        <tr v-for="(plan,items) in my_projects" :key="plan.plan_code">
          <td>{{ items + 1 }}</td>

          <td style="text-align: left;padding-left: 10px">{{ plan.project_name }}</td>
          <td style="text-align: left;padding-left: 10px">{{ plan.project_code }}</td>

          <td style="text-align: left;padding-left: 10px">
            <button class="check-bom"  @click="showPlan(plan.plan_code,plan.status,plan.designer,true)">{{ plan.plan_description }}</button>
          </td>

          <td>{{ plan.designer }}</td>
          <td>{{ plan.checker }}</td>

          <td v-if="plan.status==='1'"><span style="color: orangered">校核中</span></td>
          <td v-if="plan.status==='2'"><span style="color: orangered">审批中</span></td>

          <td>{{ plan.adjust_price_msg }}</td>
          <td>
            <button @click="setHaveCheck(plan.plan_code,'no')">已审查</button>
            <button @click="setHaveCheck(plan.plan_code,'yes')">撤回</button>
          </td>
        </tr>
      </table>
      <el-divider></el-divider>
    </div>




  </div>
</template>

<script>


import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'TbCheckPrice',
  components: {

  },
  data(){
    return {

      my_projects:[]
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
  },
  methods: {
    showPlan(planCode, status, designer, ifOnlyCheck) {
      this.$router.push({
        path:'tbTrackbom',
        query:{
          planCode: planCode,
          edt:ifOnlyCheck
        }
      })
    },
    //获取本人项目信息和编号
    fetchCheckPriceData() {
      console.log("$$$",process.env.VUE_APP_BASE_API + '/api/findCheckPricePlan')
      fetch(process.env.VUE_APP_BASE_API + '/api/findCheckPricePlan', {
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
          this.my_projects = r.data
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },

    //标记是否已查
    setHaveCheck(plan_code,revoke) {
      let data = {
        name:this.name,
        planCode : plan_code,
        revoke : revoke,
      }
      fetch(process.env.VUE_APP_BASE_API + '/api/haveCheckPricePlan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify(data)
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
          this.fetchCheckPriceData()
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },

    //标记是否已查

  },
  mounted(){
    this.fetchCheckPriceData()
  }

}
</script>

<style scoped>
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

table {
  margin-left: 0px;
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

a {
  color: #0e5ada;
  text-decoration: underline;
}
link-item{
  color: #0e5ada;
  text-decoration: underline;
}
.check-bom{
  border:none;
  background-color: transparent;
  cursor:pointer;
  color: #0e5ada;
  text-decoration: underline;
}
.check-bom:hover{
  color:#6ea2d7
}
.check-bom:visited{
  color: #a46ed7
}

</style>
