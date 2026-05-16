<template>
  <div style="background:#000d4a url(images/bg.jpg) center top;">
    <!--    <div class="loading">-->
    <!--      <div class="loadbox"><img src="./picture/loading.gif"> 页面加载中...</div>-->
    <!--    </div>-->
    <div class="back"></div>
    <div class="head">
      <h1>江苏新恒源信息平台</h1>
      <div class="weather"><span id="showTime"></span></div>
    </div>
    <div class="mainbox">
      <ul class="clearfix">
        <li>
          <div class="boxall" style="height:545px;">

            <div class="navboxall">
              <div class="sycm">
                <ul class="clearfix">
                  <li>
                    <h2>2亿</h2>
                    <span>本月目标额</span></li>
                  <li>
                    <h2>970万</h2>
                    <span>本月已完成</span></li>

                </ul>

              </div>

              <ul class="jindu clearfix">
                <div>2026年</div>
                <div>3月</div>
                <li id="zb1"></li>
                <li id="zb2"></li>
                <li id="zb3"></li>
                <li id="zb4"></li>
              </ul>
            </div>
          </div>
        </li>
        <li>
          <div class="boxall" style="height:545px">
            <div class="alltitle">2025计划指标完成对比</div>
            <div class="navboxall" id="echart4"></div>
          </div>
        </li>
        <li>
          <div class="boxall" style="height:260px">
            <div class="alltitle">区域报价</div>
            <div class="navboxall" id="echart1"></div>
          </div>
          <div class="boxall" style="height:270px">
            <div class="alltitle">类型报价</div>
            <div class="navboxall" id="echart2"></div>
          </div>
        </li>
      </ul>
      <ul class="clearfix">
        <li>
          <div class="boxall" style="height:390px;">
            <div class="alltitle">前线喜报</div>
            <div class="navboxall">
              <div class="wraptit"><span>订单号</span><span>中标金额</span><span>中标时间</span><span>容量</span>
              </div>
              <div class="wrap">
                <ul>
                  <li><p><span>刘倩倩</span><span>34,000,000</span><span>04-27</span><span>200MW</span></p></li>
                  <li><p><span>Pedro Romero</span><span>2,758,609</span><span>04-15</span><span>5MW</span></p></li>
                  <li><p><span>卓亚</span><span>8,822,215</span><span>03-13</span><span>61.3MW</span></p></li>
                  <li><p><span>刘争春</span><span>863,856</span><span>03-13</span><span>4.5MW</span></p></li>
                  <li><p><span>营销中心EPC</span><span>2,093,253</span><span>02-10</span><span>劳务采购</span></p></li>
                  <li><p><span>营销中心EPC</span><span>66,123,533</span><span>01-29</span><span>材料采购</span></p></li>
                  <li><p><span>国际中心-王宁</span><span>3,580,934</span><span>01-22</span><span>200MW</span></p></li>
                  <li><p><span>北京办-张恒豪</span><span>26,543,200</span><span>01-12</span><span>101.08MW</span></p></li>
                  <li><p><span>营销中心</span><span>15,714,663</span><span>12-25</span><span>93MW</span></p></li>
                  <li><p><span>北京办-张恒豪</span><span>21,640,788</span><span>12-25</span><span>100MW</span></p></li>
                  <li><p><span>国际业务中心</span><span>26,543,000</span><span>12-25</span><span>350MW</span></p></li>
                  <li><p><span>营销中心-权波波</span><span>6,881,433</span><span>12-18</span><span>22.5MW</span></p></li>
                  <li><p><span>Eduardo Benitez</span><span>,946,894</span><span>12-12</span><span>7.15MW</span></p></li>
                  <li><p><span>营销中心EPC</span><span>20,085,889</span><span>12-12</span><span>100MW</span></p></li>
                  <li><p><span>营销中心-彭立波</span><span>13,113,348</span><span>12-12</span><span>70.25W</span></p></li>
                  <li><p><span>营销中心</span><span>292,893,772</span><span>12-08</span><span>2GW</span></p></li>
                  <li><p><span>国际业务中心-王炬友</span><span>1,080,000</span><span>12-02</span><span>2MW</span></p></li>
                  <li><p><span>国际业务中心-王炬友</span><span>13,430,000</span><span>12-02</span><span>82.1MW</span></p></li>
                  <li><p><span>营销中心-彭飞</span><span>14,660,771</span><span>11-28</span><span>82.1MW</span></p></li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li style="width:38%">
          <div class="boxall" style="height:390px">
            <div class="alltitle">销售新增项目资询数量</div>
            <div class="navboxall" id="echart3"></div>
          </div>
        </li>
        <li style="width:38%">
          <div class="boxall" style="height:390px">
            <div class="alltitle">技术完成咨询数量</div>
            <div class="navboxall" id="echart5"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
// import liMarquee from './js/jquery.limarquee.js'
// import cxselect from './js/jquery.cxselect.min.js'

export default {
  name: 'Daping',
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {

  },
  mounted() {
    this.timeRoll()
    this.echarts_1()
    this.echarts_2()
    this.echarts_3()
    this.echarts_4()
    this.echarts_5()
    this.zb1()
    this.zb2()
    this.zb3()
    this.zb4()
  },
  methods: {
    timeRoll() {
      let t = null
      t = setTimeout(time, 1000)//開始运行
      function time() {
        clearTimeout(t)//清除定时器
        let dt = new Date()
        let y = dt.getFullYear()
        let mt = dt.getMonth() + 1
        let day = dt.getDate()
        let h = dt.getHours()//获取时
        let m = dt.getMinutes()//获取分
        let s = dt.getSeconds()//获取秒
        document.getElementById('showTime').innerHTML = y + '年' + mt + '月' + day + '日' + h + '时' + m + '分' + s + '秒'
        t = setTimeout(time, 1000) //设定定时器，循环运行
      }
    },

    echarts_1() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('echart1'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          right: 10,
          top: 30,
          height: 140,
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 10,
          textStyle: {
            color: 'rgba(255,255,255,.6)',
            fontSize: 12
          },
          orient: 'vertical',
          data: ['中东非', '亚太', '欧洲', '拉美']
        },
        calculable: true,
        series: [
          {
            name: ' ',
            color: ['#62c98d', '#2f89cf', '#4cb9cf', '#53b666', '#62c98d', '#205acf', '#c9c862', '#c98b62', '#c962b9', '#7562c9', '#c96262'],
            type: 'pie',
            radius: [30, 70],
            center: ['35%', '50%'],
            roseType: 'radius',
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },

            lableLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            data: [
              { value: 184, name: '中东非' },
              { value: 198, name: '亚太' },
              { value: 167, name: '欧洲' },
              { value: 66, name: '拉美' }
            ]
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    echarts_2() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('echart2'))

      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          right: 10,
          top: 30,
          height: 140,
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 10,
          textStyle: {
            color: 'rgba(255,255,255,.6)',
            fontSize: 12
          },
          orient: 'vertical',
          data: ['Fixed Structure', '1P Tracker', '2P Tracker', 'Car Shed', 'Tensile Structure', 'Other']
        },
        calculable: true,
        series: [
          {
            name: ' ',
            color: ['#62c98d', '#205acf', '#c9c862', '#c98b62', '#c962b9', '#7562c9', '#c96262'],
            type: 'pie',
            radius: [30, 70],
            center: ['35%', '50%'],
            roseType: 'radius',
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },

            lableLine: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },

            data: [
              { value: 50, name: 'Fixed Structure' },
              { value: 45, name: '1P Tracker' },
              { value: 35, name: '2P Tracker' },
              { value: 30, name: 'Car Shed' },
              { value: 30, name: 'Tensile Structure' },
              { value: 30, name: 'Other' }
            ]
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    echarts_3() {
      /*   */
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('echart3'))

      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#dddc6b'
            }
          }
        },
        grid: {
          left: '10',
          top: '20',
          right: '30',
          bottom: '10',
          containLabel: true
        },

        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: 'rgba(255,255,255,.6)',
              fontSize: 16
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }

          },

          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

        }, {

          axisPointer: { show: false },
          axisLine: { show: false },
          position: 'bottom',
          offset: 20

        }],

        yAxis: [{
          type: 'value',
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }
          },
          axisLabel: {
            textStyle: {
              color: 'rgba(255,255,255,.6)',
              fontSize: 16
            }
          },

          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }
          }
        }],
        series: [
          {
            name: '结算率',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {

              normal: {
                color: '#dddc6b',
                width: 4
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(221, 220, 107, 0.4)'
                }, {
                  offset: 0.8,
                  color: 'rgba(221, 220, 107, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)'
              }
            },
            itemStyle: {
              normal: {
                color: '#dddc6b',
                borderColor: 'rgba(221, 220, 107, .1)',
                borderWidth: 12
              }
            },
            data: [3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]

          }

        ]

      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    echarts_4() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('echart4'))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['目标销售额', '目标完成额'],
          align: 'right',
          right: '40%',
          top: '0%',
          textStyle: {
            color: '#fff',
            fontSize: '16'

          },
          itemWidth: 16,
          itemHeight: 16,
          itemGap: 35
        },
        grid: {
          left: '0%',
          top: '40px',
          right: '0%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月','1月'],
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,.1)',
              width: 1,
              type: 'solid'
            }
          },

          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            // rotate:50,
            show: true,
            splitNumber: 15,
            textStyle: {
              color: 'rgba(255,255,255,.6)',
              fontSize: '16'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          axisLabel: {
            // formatter: '{value} 亿',
            show: true,
            textStyle: {
              color: 'rgba(255,255,255,.6)',
              fontSize: '16'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,.1	)',
              width: 1,
              type: 'solid'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }
          }
        }],
        series: [{
          name: '目标销售额',
          type: 'bar',
          data: [2.5, 2.1, 2.6, 2.9, 2.3, 2.7, 3.2, 3.3, 3.3, 2.7, 5.1, 1.8,2.0],
          barWidth: '15', //柱子宽度
          // barGap: 1, //柱子之间间距
          itemStyle: {
            normal: {
              color: '#2f89cf',
              opacity: 1,
              barBorderRadius: 5
            }
          }
        }, {
          name: '目标完成额',
          type: 'bar',
          data: [1.783, 0.898, 2.569, 1.799, 2.783, 2.027, 1.266, 1.024, 2.927, 2.636, 0.973, 5.109,0.4861],
          barWidth: '15',
          // barGap: 1,
          itemStyle: {
            normal: {
              color: '#62c98d',
              opacity: 1,
              barBorderRadius: 5
            }
          }
        }
        ]
      }

      /*   */
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    echarts_5() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('echart5'))
      let option = {
        //  backgroundColor: '#00265f',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['2025年', '2026年'],
          align: 'right',
          right: '40%',
          top: '0%',
          textStyle: {
            color: '#fff',
            fontSize: '16'

          },

          itemGap: 35
        },
        grid: {
          left: '0%',
          top: '40px',
          right: '0%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,.1)',
              width: 1,
              type: 'solid'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            // rotate:50,
            show: true,
            splitNumber: 15,
            textStyle: {
              color: 'rgba(255,255,255,.6)',
              fontSize: '16'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          axisLabel: {
            //formatter: '{value} %'
            show: true,
            textStyle: {
              color: 'rgba(255,255,255,.6)',
              fontSize: '16'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,.1	)',
              width: 1,
              type: 'solid'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }
          }
        }],
        series: [{
          name: '2025年',
          type: 'line',

          data: [2, 6, 3, 8, 5, 8, 10, 13, 8, 5, 6, 9],

          itemStyle: {
            normal: {
              color: '#2f89cf',
              opacity: 1,

              barBorderRadius: 5
            }
          }
        }, {
          name: '2026年',
          type: 'line',
          data: [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          barWidth: '15',
          // barGap: 1,
          itemStyle: {
            normal: {
              color: '#62c98d',
              opacity: 1,
              barBorderRadius: 5
            }
          }
        }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    zb1() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('zb1'))
      var v1 = 60//结算数
      var v2 = 40//未结算数
      var v3 = v1 + v2//总订单数
      let option = {
        series: [{
          type: 'pie',
          radius: ['60%', '70%'],
          color: '#49bcf7',
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [{
            value: v1,
            name: '年完成率',
            label: {
              normal: {
                formatter: Math.round(v1 / v3 * 100) + '%',
                textStyle: {
                  fontSize: 30,
                  color: '#fff'
                }
              }
            }
          },
            {
              value: v2,
              label: {
                normal: {
                  formatter: function(params) {
                    return '数量结算率'
                  },
                  textStyle: {
                    color: '#aaa',
                    fontSize: 16
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(255,255,255,.2)'
                },
                emphasis: {
                  color: '#fff'
                }
              }
            }]
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    zb2() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('zb2'))
      var v1 = 80//结算数
      var v2 = 20//未结算数
      var v3 = v1 + v2//总订单数
      let option = {

        animation: false,
        series: [{
          type: 'pie',
          radius: ['60%', '70%'],
          color: '#49bcf7',
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [{
            value: v1,
            name: '数量结算率',
            label: {
              normal: {
                formatter: Math.round(v1 / v3 * 100) + '%',
                textStyle: {
                  fontSize: 24,
                  color: '#fff'
                }
              }
            }
          }, {
            value: v2,
            label: {
              normal: {
                formatter: function(params) {
                  return '数量结算率'
                },
                textStyle: {
                  color: '#aaa',
                  fontSize: 16
                }
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(255,255,255,.2)'
              },
              emphasis: {
                color: '#fff'
              }
            }
          }]
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    zb3() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('zb3'))
      var v1 = 30//结算金额
      var v2 = 70//未结算
      var v3 = v1 + v2
      let option = {
        series: [{

          type: 'pie',
          radius: ['60%', '70%'],
          color: '#62c98d',
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [{
            value: v1,
            name: '金额结算率',
            label: {
              normal: {
                formatter: Math.round(v1 / v3 * 100) + '%',
                textStyle: {
                  fontSize: 24,
                  color: '#fff'
                }
              }
            }
          }, {
            value: v2,
            label: {
              normal: {
                formatter: function(params) {
                  return '金额结算率'
                },
                textStyle: {
                  color: '#aaa',
                  fontSize: 16
                }
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(255,255,255,.2)'
              },
              emphasis: {
                color: '#fff'
              }
            }
          }]
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    zb4() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('zb4'))
      var v1 = 90//结算金额
      var v2 = 10//未结算
      var v3 = v1 + v2
      let option = {
        series: [{

          type: 'pie',
          radius: ['60%', '70%'],
          color: '#29d08a',
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [{
            value: v1,
            name: '金额结算率',
            label: {
              normal: {
                formatter: Math.round(v1 / v3 * 100) + '%',
                textStyle: {
                  fontSize: 24,
                  color: '#fff'
                }
              }
            }
          }, {
            value: v2,
            label: {
              normal: {
                formatter: function(params) {
                  return '金额结算率'
                },
                textStyle: {
                  color: '#aaa',
                  fontSize: 16
                }
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(255,255,255,.2)'
              },
              emphasis: {
                color: '#fff'
              }
            }
          }]
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    }

  }
}
</script>


<style src="./css/comon0.css" scoped>

</style>
