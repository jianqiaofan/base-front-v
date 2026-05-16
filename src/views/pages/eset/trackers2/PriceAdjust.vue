<template>
  <div>
    <h1>价格调整</h1>
    <div id="chart01" style="width: 1200px;height: 400px;background-color: #c4dacf;margin: 10px"></div>

    <table>
      <caption style="text-align: right">
        <!--        <el-button type="primary" size="mini" @click="getSystemPriceCategory">测试总价计算</el-button>-->
        <div>
          <el-button type="primary" size="mini" @click="findPlanAdjustPrice">图表显示</el-button>
          <el-button type="warning" size="mini" @click="saveAdjustPrice">保存我的调价</el-button>
          <el-button type="danger" size="mini" @click="deleteAdjustPrice">删除我的调价</el-button>
        </div>
      </caption>
      <thead>
      <tr>
        <td colspan="15" style="text-align: left">

          <p>价格说明：</p>
          <p>1、项目总容量{{planTotalCapacity}}Mw,调整系数为{{capacityAdjustRaito}}(0~5Mw:1.1,5~20Mw:1.05,大于20Mw:1.0,调价仅作用于立柱、主梁和檩条)</p>
          <p>2、沙特项目请采用本地化材料价格</p>
        </td>

      </tr>
      <tr>
        <td rowspan="2" style="width: 400px;">材料名称</td>
        <td rowspan="2">计价方式</td>
        <td rowspan="2">材料总量<br>(吨或件)</td>
        <td colspan="3">
          <button @click="priceChange">系统价格</button>
        </td>
        <td colspan="3">
          <button @click="priceChange">价格调整</button>
        </td>
        <td colspan="9">我的调价</td>
      </tr>
      <tr>
        <!--        <td style="width: 300px;">材料名称</td>-->
        <!--        <td>计价方式</td>-->
        <!--        <td>总量</td>-->
        <td>系统价格</td>
        <td>材料总价</td>
        <td>价格占比%</td>
        <td>调后价</td>
        <td>材料总价</td>
        <td>价格占比%</td>
        <td>原材价</td>
        <td>利用率</td>
        <td>镀锌费</td>
        <td>加工费</td>
        <td>包装费</td>
<!--        <td>国内<br>运费</td>-->
<!--        <td>出口<br>退税</td>-->
<!--        <td>进口<br>关税</td>-->
<!--        <td>海运费</td>-->
      </tr>
      </thead>


      <tbody>
      <tr v-for="p in priceData" :key="p.id" v-show="p.cp>0">
        <td style="text-align: left">{{ p.item }}</td>
        <td>{{ p.pm }}</td><!--计价方式-->
        <td>{{ p.totalAmount }}</td><!--总数量-->
        <td style="color: #001daf;text-align: right">{{ p.cp }}</td>  <!--系统给的材料价格-->
        <td>{{ p.totalPriceBySystem }}</td> <!--系统报价-->
        <td>{{ p.totalPriceBySystemRatio }}</td><!--系统报价占比-->

        <td style="color: red;text-align: right">{{ p.afterAdjustPrice }}</td>  <!--调后价综合单价-->
        <td style="color: red;text-align: right"></td>  <!--如果调价，字体为红色-->
        <td style="text-align: right"></td>  <!--如果调价，字体为红色-->

        <td><input type="text" @change="priceChange" v-model="p.pd.rmp" style="width: 70px;"></td>
        <!--      rmp:原材料价格Raw material price-->
        <td><input type="text" @change="priceChange" v-model="p.pd.utr"></td>  <!--      utr:利用率Utilization rate-->
        <td><input type="text" @change="priceChange" v-model="p.pd.sft"></td>
        <td><input type="text" @change="priceChange" v-model="p.pd.psf"></td>  <!--      psf:加工费Processing fee-->
        <!--      sft:表面处理费(镀锌费)Surface treatment fee-->
        <td><input type="text" @change="priceChange" v-model="p.pd.pkf"></td>  <!--      pkf:包装费Packaging fee-->
<!--        <td><input type="text" @change="priceChange" v-model="p.pd.dfc"></td>-->
        <!--      dfc:国内运费Domestic freight charges-->
<!--        <td><input type="text" @change="priceChange" v-model="p.pd.exr"></td>  &lt;!&ndash;      exr:出口退税Export rebate&ndash;&gt;-->
<!--        <td><input type="text" @change="priceChange" v-model="p.pd.imt"></td>  &lt;!&ndash;      imt:进口关税Import tariff&ndash;&gt;-->
<!--        <td><input type="text" @change="priceChange" v-model="p.pd.ocf"></td>  &lt;!&ndash;      ocf:海运费Ocean freight&ndash;&gt;-->
        <!--        <td>{{p.afterAdjustPrice}}</td>  &lt;!&ndash;      调整后综合单价&ndash;&gt;-->
      </tr>


      </tbody>

    </table>

  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import echarts from 'echarts/lib/echarts'
import { formatNumber } from '@/views/pages/eset/trackers2/utils/myUtils.js'
import {
  calculateTrackerAttributes,
  getEcharSourceCategory1,
  getPlanTotalCapacity,getCapacityAdjustRatio,
  getTrackerCategroyA
} from '@/views/pages/eset/trackers2/utils/classPlan.js'
import { mapGetters } from 'vuex'

//获取柱子列表字符串
export default {
  name: 'PriceAdjust',
  data() {
    return {
      planPriceAdjust:{},
      priceData:this.systemPrice  //按系统报价计算完总价的，有相同材料ID的数据
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    planTotalCapacity(){
      return getPlanTotalCapacity(this.theWholePlan)/1000000
    },
    capacityAdjustRaito(){
      return getCapacityAdjustRatio(1000000*this.planTotalCapacity)
    }

  },
  methods: {
    priceChange() {
      for (let i = 0; i < this.priceData.length; i++) {
        let pd = this.priceData[i].pd
        if (pd.utr <= 0) {
          pd.utr = 1.0
        }
        this.priceData[i].afterAdjustPrice = (1 * pd.rmp / pd.utr
          + 1 * pd.psf + 1 * pd.sft + 1 * pd.pkf + 1 * pd.dfc - 1 * pd.exr + 1 * pd.imt + 1 * pd.ocf).toFixed(2)  //调整后的价格
      }
      //解决数组数据改变后页面不实时刷新的问题，
      // 解决思路：vue对push,pop,shift,unshift,splice,sort,reverse七个变更方法进行的包裹，会触发页面更新
      this.priceData.splice(0, 1, this.priceData[0])
      this.getItemTotalPrice()  //按priceId分类，计算各priceId的总价

    },

    //按priceId分类，计算各priceId的总价，总数量（按吨计算时数量为吨，按件计算时数量为件）
    getItemTotalPrice() {
      for (let i = 0; i < this.priceData.length; i++) {
        this.priceData[i].totalPriceBySystem = 0  //用于保存整个plan的各材料总价格
        this.priceData[i].totalAmount = 0  //用于保存整个plan的数量
      }
      for (let i = 0; i < this.priceData.length; i++) {
        for (let j = 0; j < this.theWholePlan.trackersInfo.length; j++) {  //循环一个plan中的所有支架
          let trackerNum = this.theWholePlan.trackersInfo[j].trackerNum //这种支架的数量
          let tracker = calculateTrackerAttributes(this.theWholePlan.trackersInfo[j])  //补上_unitPrice属性
          tracker.resultList.bom1.forEach(b => {
            if (this.priceData[i].id === b.priceId) {
              this.priceData[i].totalPriceBySystem += 1 * b._unitPrice * b.amount * trackerNum
              // //计算数量
              if (this.priceData[i].pm === '按吨重') {
                this.priceData[i].totalAmount += 1 * b.totalWeight * trackerNum / 1000
              }
              if (this.priceData[i].pm === '按件') {
                this.priceData[i].totalAmount += 1 * b.amount * trackerNum
              }
            }
          })
        }
      }
      //计算整个plan的总价
      let totalPlanPrice = 0
      for (let i = 0; i < this.priceData.length; i++) {
        totalPlanPrice += this.priceData[i].totalPriceBySystem
      }
      //计算各项所占百分比
      if (totalPlanPrice < 10) {
        totalPlanPrice = 10
      }  //防止被0除
      for (let i = 0; i < this.priceData.length; i++) {
        this.priceData[i].totalPriceBySystemRatio = (100 * this.priceData[i].totalPriceBySystem / totalPlanPrice)
      }
      //数字格式化
      for (let i = 0; i < this.priceData.length; i++) {
        this.priceData[i].cp = 1 * this.priceData[i].cp.toFixed(2)
        this.priceData[i].totalPriceBySystem = this.priceData[i].totalPriceBySystem.toFixed(2)
        this.priceData[i].totalPriceBySystemRatio = (100 * this.priceData[i].totalPriceBySystem / totalPlanPrice).toFixed(1)
        this.priceData[i].totalAmount = formatNumber(this.priceData[i].totalAmount, 4)
      }
    },


    //保存本人的调价信息
    saveAdjustPrice() {
      console.log('this.getAdjustItems()',this.getAdjustItems())
      if(this.theWholePlan.plan_code === null || this.theWholePlan.plan_code === undefined ||this.theWholePlan.plan_code.length===0 ){
        alert('方案没有被保存，请先保存方案后再保存我的调价！')
        return
      }
      let subData = {
        who_adjust: this.name,  //我的名字
        plan_code: this.theWholePlan.plan_code,
        adjust_price_details: this.getAdjustItems()  //经过了比对后，将有价格变化的内容保存下来
      }
      fetch(process.env.VUE_APP_BASE_API + '/api/saveMyAdjustPrice', {
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
            alert('保存调价信息成功!')
            this.findPlanAdjustPrice()  //重新刷新图表内容
          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },


    //确认删除调价信息
    deleteAdjustPrice() {
      let subData = {
        who_adjust: this.name,  //我的名字
        plan_code: this.theWholePlan.plan_code,
      }
      this.$confirm('此操作将永久删除我的调价, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        fetch(process.env.VUE_APP_BASE_API + '/api/deleteMyAdjustPrice', {
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
              this.$message.success(response.message || '删除成功')

              //fdsa
              this.findPlanAdjustPrice()  //重新刷新图表内容
            } else {
              // 如果响应状态码不是2xx，抛出错误
              throw new Error('Something went wrong on server side.')
            }
          })
          .catch(error => {
            // 捕捉fetch过程中或处理响应时的错误
            console.error('Error:', error)
          })

      }).catch(() => {
        this.$message.info('取消删除')
      })
    },

    //查找项目调价信息
    findPlanAdjustPrice(){
      let subData = {
        plan_code: this.theWholePlan.plan_code,
      }
      fetch(process.env.VUE_APP_BASE_API + '/api/findPlanAdjustPrice', {
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
            return response.json()
          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
        .then(r=>{
          this.planPriceAdjust=  JSON.parse(r.data)
          if(this.planPriceAdjust === null){this.planPriceAdjust=[]}
          this.planPriceAdjust.unshift({ who_adjust:'系统报价',adjust_price_details: {} })
          this.replaceAdjustPriceDetails()  //更新本人的调价细节
          this.showBarChart()  //刷新图表
          this.receive(this.planPriceAdjust);  //通知父组件更新调价信息
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },
    //获取经过手工调价的内容
    getAdjustItems(){
      //用比对算法
      let adjustObj = {}
      for (let i = 0; i < this.priceData.length; i++) {
        let price = 1 * this.priceData[i].cp  //原价格
        let pd = this.priceData[i].pd  //原价格记录
        let newPrice = (1 * pd.rmp / pd.utr + 1 * pd.psf
          + 1 * pd.sft + 1 * pd.pkf + 1 * pd.dfc - 1 * pd.exr + 1 * pd.imt + 1 * pd.ocf).toFixed(2)  //调整后的价格
        //如果有调价动作,则记录下来
        if (Math.abs(price - newPrice) > 0.001) {
          adjustObj[this.priceData[i].id]=pd
        }
      }
      return adjustObj
    },

    //如果本人有过调价，那么在显示表格内容时，要显示本人调过的价
    replaceAdjustPriceDetails(){
      // console.log("this.planPriceAdjust",JSON.stringify(this.planPriceAdjust))
      let myAdjustObj
      this.planPriceAdjust.forEach(p=>{
        if(p.who_adjust === this.name){
          myAdjustObj = p
        }
      })
      if(myAdjustObj!==undefined){
        console.log('myAdjustObj.adjust_price_details',myAdjustObj.adjust_price_details)
        this.priceData.forEach(p=>{
          if(p.id in myAdjustObj.adjust_price_details){
            p.pd = myAdjustObj.adjust_price_details[p.id]
          }
        })
      }
    },

    //展示柱状图表
    showBarChart() {
      let myChart = echarts.init(document.getElementById('chart01'))
      // let dimensions = ['price', '系统报价', '张三', '李四']
      let source = [
        // { price: '减速机', '系统报价': 72.4, '张三': 53.9, '李四': 39.1 },
        // { price: '控制系统', '系统报价': 72.4, '张三': 53.9, '李四': 39.1 },
        // { price: '阻尼', '系统报价': 72.4, '张三': 53.9, '李四': 39.1 },
        // { price: '立柱', '系统报价': 72.4, '张三': 53.9, '李四': 39.1 },
        // { price: '主梁', '系统报价': 72.4, '张三': 53.9, '李四': 39.1 },
        // { price: '檩条', '系统报价': 72.4, '张三': 53.9, '李四': 39.1 },
        // { price: '冲压件', '系统报价': 72.4, '张三': 53.9, '李四': 39.1 },
        // { price: '铸造件', '系统报价': 72.4, '张三': 53.9, '李四': 39.1 },
        // { price: '紧固件', '系统报价': 72.4, '张三': 53.9, '李四': 39.1 },
        // { price: '其它', '系统报价': 72.4, '张三': 53.9, '李四': 39.1 }
      ]
      // let series = [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
      let obj = {}
      let pac = this.planPriceAdjust
      let dimensions = ['price']
      let series = []
      for (let i = 0; i < pac.length; i++) {
        dimensions.push(pac[i].who_adjust)
        series.push({ type: 'bar' })
      }
      // source = this.getEcharSource()
      this.getItemTotalPrice() //计算this.priceData[i]的totalPriceBySystem，原始的是没有的
      source = getEcharSourceCategory1(this.priceData,this.planPriceAdjust)
      var option = {
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: dimensions,
          source: source
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: series
      }
      option && myChart.setOption(option)
    },

  },

  filters: {
    filterFormat(value) {
      if (value) {
        return value
      } else {
        return ''
      }
    }
  },

  props: {
    receive:Function,
    theWholePlan: {},  //整个方案信息
    systemPrice: {}  //系统自动计算的价格
  },

  mounted() {
    this.findPlanAdjustPrice()
    console.log("this.systemPrice",this.systemPrice)

  }

}

</script>

<style scoped>
/* CSS样式 */
table {
  margin-left: 10px;
  border-collapse: collapse; /* 确保边框不会重叠 */
  border: 1px solid black; /* 设置表格边框颜色和宽度 */

}

th, td {
  text-align: center;
  border: 1px solid black; /* 设置表格内部单元格边框颜色和宽度 */
}

tbody tr td input {
  width: 60px;
}


</style>
