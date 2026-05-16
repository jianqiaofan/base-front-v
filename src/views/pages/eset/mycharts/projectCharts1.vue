<template>
  <div class="container">
    <div>
      <div id="chart1"></div>
      <div id="chart2"></div>
    </div>
    <div>
      <div id="chart3"></div>
      <div id="chart4"></div>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import api from '@/api/eset/tbProjectTechnical'
import echarts from 'echarts/lib/echarts'

const defaultForm = {}
export default {
  components: {},
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: [], // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 1, // 每页记录数
      searchObj: {} // 查询表单对象
    }
  },
  methods: {
    showChart1(data) {
      var chartDom = document.getElementById('chart1')
      var myChart = echarts.init(chartDom)
      var option
      option = {
        title: {
          text: '月创建项目数量(近12个月)',
          textAlign: 'left',
          padding: [10, 340],
          textStyle: {
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'item'
        },
        dataset: {
          dimensions: ['数量'],
          source: data[1]
        },
        xAxis: {
          name: '月份',
          type: 'category',
          nameGap: 10,
          data: data[0],
          axisLabel: {
            interval: 0,
            rotate: 45 // 设置刻度标签旋转 45 度
          }
        },
        yAxis: {
          name: '数量',
          type: 'value'
        },
        series: [
          {
            data: data[1],
            type: 'bar'
          }
        ]
      }
      option && myChart.setOption(option)
    },

    showChart2(data) {
      var chartDom = document.getElementById('chart2')
      var myChart = echarts.init(chartDom)
      var arrayObj = []
      let sum = data[1].reduce((a,b)=>a+b,0)
      for (let i = 0; i < data[0].length; i++) {
        let obj = {
          name: data[0][i]+"   "+(Math.round(10000*data[1][i]/sum)/100) + '%',
          value: data[1][i]
        }
        arrayObj.push(obj)
      }
      var option = {
        title: {
          text: '售前设计项目量(近12个月)',
          textAlign: 'left',
          padding: [10, 340],
          textStyle: {
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient:'vertical',
          left: 10,
          top:40,
          textStyle:{
            fontSize:18
          }

        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: arrayObj
          }
        ]
      }
      option && myChart.setOption(option)
    },

    showChart3(data) {
      var chartDom = document.getElementById('chart3')
      var myChart = echarts.init(chartDom)
      var option
      option = {
        title: {
          text: '年度参与项目数',
          textAlign: 'left',
          padding: [10, 340],
          textStyle: {
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'item'
        },
        dataset: {
          dimensions: ['数量'],
          source: data[1]
        },
        xAxis: {
          name: '姓名',
          type: 'category',
          nameGap: 10,
          data: data[0],
          axisLabel: {
            interval: 0,
            rotate: 90 // 设置刻度标签旋转 45 度
          }
        },
        yAxis: {
          name: '参与项目数量',
          type: 'value'
        },
        series: [
          {
            data: data[1],
            type: 'bar'
          }
        ]
      }
      option && myChart.setOption(option)
    },

    showChart4(data) {
      var chartDom = document.getElementById('chart4')
      var myChart = echarts.init(chartDom)
      var option
      option = {
        title: {
          text: '年度设计总容量(Mw)',
          textAlign: 'left',
          padding: [10, 340],
          textStyle: {
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'item'
        },
        dataset: {
          dimensions: ['数量'],
          source: data[1]
        },
        xAxis: {
          name: '姓名',
          type: 'category',
          nameGap: 10,
          data: data[0],
          axisLabel: {
            interval: 0,
            rotate: 90 // 设置刻度标签旋转 45 度
          }
        },
        yAxis: {
          name: '容量(Mw)',
          type: 'value'
        },
        series: [
          {
            data: data[1],
            type: 'bar'
          }
        ]
      }
      option && myChart.setOption(option)
    },

    // 加载数据
    fetchAllTechnicalProject(page = 1) {
      debugger
      api.getAllTbClass(this.searchObj).then(
        response => {
          this.list = response.data
          this.total = response.data.total
          // 数据加载并绑定成功
          this.listLoading = false
          this.showChart1(this.statisticsStartProjectByMonthly())
          this.showChart2(this.statisticsByCategory())
          this.showChart3(this.statisticsAnnualProjectByDesigner())//统计设计师全年参与项目数
          this.showChart4(this.statisticsAnnualCapacityByDesigner())//统计设计师全年设计总容量

        }
      )
    },

    //根据月份统计开始项目
    statisticsStartProjectByMonthly() {
      //1、获取月份
      let monthly = []
      const reg = /\d{4}-\d{1,2}/
      this.list.forEach(p => {
        if (reg.test(p.designStartDate)) {
          let ma = p.designStartDate.match(reg)[0]
          if (!monthly.includes(ma)) {
            monthly.push(ma)
          }
        }
      })
      monthly = monthly.sort()
      let allMonthly = []
      this.list.forEach(p => {
        if (reg.test(p.designStartDate)) {
          let ma = p.designStartDate.match(reg)[0]
          allMonthly.push(ma)
        }
      })

      let objCount = []
      monthly.forEach(target => {
        let count = allMonthly.filter(value => value === target).length
        objCount.push(count)
      })
      return [monthly, objCount]
    },
    //根据项目各类统计
    statisticsByCategory() {
      let categorys = ['Fixed Structure', '1P Tracker', '2P Tracker', 'Car Shed', 'Tensile structure', 'Other']
      const categoryArray = this.list.map(item => item.category)
      let objCount = []
      categorys.forEach(target => {
        let count = categoryArray.filter(value => value.includes(target)).length
        objCount.push(count)
      })
      return [categorys, objCount]
    },

    //统计设计师年参与设计项目总量
    statisticsAnnualProjectByDesigner() {
      const designerAllArray = this.list.map(item => item.designer)
      let set = new Set(designerAllArray)
      let list = []
      set.forEach(s => {
        if (s.indexOf('/') != -1) {
          let arr = s.split('/')
          arr.forEach(d => {
            list.push(d)
          })
        } else {
          list.push(s)
        }
      })
      set = new Set(list)
      let designerArrayUni = []  //全部的，去重的设计师姓名
      set.forEach(s => {
        if (s.length > 1) {
          designerArrayUni.push(s)
        }
      })
      let objCount = []
      designerArrayUni.forEach(target => {
        let count = designerAllArray.filter(value => value.includes(target)).length
        objCount.push(count)
      })
      return [designerArrayUni, objCount]
    },

    //统计设计师年参与设计项目总数量
    statisticsAnnualCapacityByDesigner() {
      const designerAllArray = this.list.map(item => item.designer)
      let set = new Set(designerAllArray)
      let list = []
      set.forEach(s => {
        if (s.indexOf('/') != -1) {
          let arr = s.split('/')
          arr.forEach(d => {
            list.push(d)
          })
        } else {
          list.push(s)
        }
      })
      set = new Set(list)
      let designerArrayUni = []  //全部的，去重的设计师姓名
      set.forEach(s => {
        if (s.length > 1) {
          designerArrayUni.push(s)
        }
      })

      this.list.forEach(item => {
        let value = this.stringToNumberOrDefault(item.capacityMw)
      })

      let objCount = []
      designerArrayUni.forEach(target => {
        let temp = 0
        this.list.forEach(item => {
          if (item.designer.includes(target)) {
            temp += this.stringToNumberOrDefault(item.capacityMw)
          }
        })
        objCount.push(temp)
      })
      return [designerArrayUni, objCount]
    },

    stringToNumberOrDefault(str) {
      // 尝试将字符串转换为数字
      const number = Number(str)

      // 检查转换后的结果是否是 NaN
      if (!Number.isNaN(number)) {
        return number
      }

      // 如果转换失败，返回 0
      return 0
    }

  },

  created() {

  },
  mounted() {
    this.fetchAllTechnicalProject()
  }

}
</script>
<style scoped>
.container {

}

#chart1 {
  display: inline-block;
  width: 900px;
  height: 600px;
  background-color: lightblue;
  border: 1px solid #000;

}

#chart2 {
  display: inline-block;
  width: 900px;
  height: 600px;
  background-color: lightblue;
  border: 1px solid #000;
}

#chart3 {
  display: inline-block;
  width: 900px;
  height: 600px;
  background-color: lightblue;
  border: 1px solid #000;

}

#chart4 {
  display: inline-block;
  width: 900px;
  height: 600px;
  background-color: lightblue;
  border: 1px solid #000;
}
</style>
