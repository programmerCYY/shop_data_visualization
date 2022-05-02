<!-- 员工数据统计的横向柱状图 -->
<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎ ' +  showTitle }}</span>
      <span class="iconfont title-icon"  :style="comStyle" @click="showChoice = !showChoice">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据
      showChoice: false,
      choiceType: "order",
      titleFontSize: 0,
      initOption: null
    }
  },
  created() {
    //组件创建完成后，进行回调函数注册
    this.$socket.registerCallBack('trendData', this.getData)

  },
  mounted () {
    this.initChart()
    // this.getData()
    // 发送数据给服务器, 告诉服务器, 我现在需要数据
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候, 主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed () {
    this.$socket.unRegisterCallBack('trendData')
    // 在组件销毁的时候, 需要将监听器取消掉
    window.removeEventListener('resize', this.screenAdapter)
  },
  computed: {
    selectTypes () {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    // 设置给标题的样式
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize + 'px',
        backgroundColor: getThemeValue(this.theme).backgroundColor, 
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  methods: {
    // 初始化echartInstance对象
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme)
      // 对图表初始化配置的控制
      const initOption = {
        grid: {
          left: '3%',
          top: '30%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: '20%',
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [
            {
                type: 'slider',
                // xAxisIndex: 0,
                // start: 0,
                // end: 10
                minSpan: 10,
                bottom: '1%'
            },
            // {
            //     type: 'slider',
            //     // yAxisIndex: 0,
            //     // start: 0,
            //     // end: 10
            // }
        ]
      }
      this.initOption = initOption
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器的数据
    async getData (ret) {
      // http://127.0.0.1:8888/api/seller
      // const { data: ret } = await this.$http.get('trenddata')
      this.allData = ret.data
      console.log('ppp',this.allData)
      this.updateChart()
    },
    // 更新图表
    updateChart () {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // 处理数据
      // 类目轴的数据
      // const timeArr = this.allData.common.month
      // y轴的数据 series下的数据
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item,index)=>{
        return {
          name:item.name,
          type: 'line',
          // stack: this.choiceType,
          showSymbol: false,
          data: item.data,
          smooth: false
        }
      })
    //   const seriesArr = valueArr.map((item, index) => {
    //     return {
    //       name: '111',
    //       type: 'line',
    //       data: item.data,
    //       stack: this.choiceType,
        //   areaStyle: {
        //     color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //       {
        //         offset: 0,
        //         color: colorArr1[index]
        //       }, // %0的颜色值
        //       {
        //         offset: 1,
        //         color: colorArr2[index]
        //       } // 100%的颜色值
        //     ])
        //   }
    //     }
    //   })
      // 图例的数据
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const dataOption = {
        // xAxis: {
        //   data: timeArr
        // },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.clear();
      this.chartInstance.setOption(this.initOption)
      this.screenAdapter ()
      this.chartInstance.setOption(dataOption)
    },
    // 当浏览器的大小发生变化的时候, 会调用的方法, 来完成屏幕的适配
    screenAdapter () {
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 2.0
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        tooltip: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        dataZoom: [
          {
            height:this.titleFontSize
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    handleSelect (currentType) {
      this.choiceType = currentType
      this.updateChart()
      this.showChoice = false
    }
  },
  watch: {
    theme () {
      console.log('主题切换了')
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart() // 重新以最新的主题名称初始化图表对象
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart() // 更新图表的展示
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: .15rem;
  top: .15rem;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: .125rem;
    cursor: pointer;
  }
  .select-con {
    background-color: #222733;
  }
}
</style>
