<!-- 员工数据统计的横向柱状图 -->
<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ "▎ " + showTitle }}</span>
      <span
        class="iconfont title-icon"
        :style="comStyle"
        @click="showChoice = !showChoice"
        >&#xe6eb;</span
      >
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div
          class="select-item"
          v-for="item in selectTypes"
          :key="item.key"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="channel_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据
      nowData: null,
      currentPage: 1, // 当前显示的页数
      totalPage: 0, // 一共有多少页
      timerId: null, // 定时器的标识
      showChoice: false, // 是否显示可选项
      choiceType: "order", // 显示的数据类型
      titleFontSize: 0, // 指明标题的字体大小
    };
  },
  created() {
    // 在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack("channelData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "channelData",
      chartName: "channel",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    // 在页面加载完成的时候, 主动进行屏幕的适配
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timerId);
    // 在组件销毁的时候, 需要将监听器取消掉
    window.removeEventListener("resize", this.screenAdapter);
  },
  computed: {
    selectTypes() {
      if (!this.allData) {
        return [];
      } else {
        return this.allData.type.filter((item) => {
          return item.key !== this.choiceType;
        });
      }
    },
    showTitle() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.choiceType].title;
      }
    },
    // 设置给标题的样式
    comStyle() {
      return {
        fontSize: this.titleFontSize / 1.5 + "px",
        color: getThemeValue(this.theme).titleColor
      };
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + "px",
        backgroundColor: getThemeValue(this.theme).backgroundColor, 
        color: getThemeValue(this.theme).titleColor
      };
    },
    ...mapState(['theme'])
  },
  methods: {
    // 初始化echartInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.channel_ref, this.theme);
      // 对图表初始化配置的控制,指针图
      // const initOption = {
      //   series: [
      //     {
      //       type: "gauge",
      //       startAngle: 90,
      //       endAngle: -250,
      //       pointer: {
      //         show: false,
      //       },
      //       progress: {
      //         show: true,
      //         overlap: false,
      //         roundCap: true,
      //         clip: false,
      //         itemStyle: {
      //           borderWidth: 1,
      //           borderColor: "#464646",
      //         },
      //       },
      //       axisLine: {
      //         lineStyle: {
      //           width: 10,
      //         },
      //       },
      //       splitLine: {
      //         show: false,
      //         distance: 0,
      //         length: 210,
      //       },
      //       axisTick: {
      //         show: false,
      //       },
      //       axisLabel: {
      //         show: false,
      //         distance: 20,
      //       },
      //       title: {
      //         fontSize: 14,
      //       },
      //       detail: {
      //         width: 20,
      //         height: 14,
      //         fontSize: 14,
      //         color: "auto",
      //         borderColor: "auto",
      //         borderRadius: 20,
      //         borderWidth: 1,
      //         formatter: "{value}%",
      //       },
      //     },
      //   ],
      // };
      const initOption = {
        legend: {
          right: "20%",
          top: "20%",
          // left:"right",
          orient: "vertical",
        },
        // toolbox: {
        //   show: true,
        //   feature: {
        //     mark: { show: true },
        //     dataView: { show: true, readOnly: false },
        //     restore: { show: true },
        //     saveAsImage: { show: true },
        //   },
        // },
        series: [
          {
            name: "Nightingale Chart",
            type: "pie",
            radius: [30, 150],
            center: ["30%", "55%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8,
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      // 对图表对象进行鼠标事件的监听
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    // 获取服务器的数据
    async getData(ret) {
      // http://127.0.0.1:8888/api/seller
      // const { data: ret } = await this.$http.get("channel");
      this.allData = ret.data;
      console.log("this.allData", this.allData);
      // 获取当前分类数据
      //   this.nowData = this.allData[this.choiceType].data.sort((a, b) => {
      //     return a.value - b.value;
      //   });
      this.nowData = this.allData[this.choiceType].data;
      // 按页更新图表数据
      this.updateChart();
    },
    // 更新图表
    updateChart() {
      // let titleOffset = -70;
      // let detailOffset = -60;
      // const addValue = 20;
      // const gaugeData1 = this.nowData.map((item, index) => {
      //   return {
      //     name: item.name,
      //     value: item.value,
      //     title: {
      //       offsetCenter: ["140%", `${titleOffset + index * addValue}%`],
      //     },
      //     detail: {
      //       valueAnimation: true,
      //       offsetCenter: ["140%", `${detailOffset + index * addValue}%`],
      //     },
      //   };
      // });
      // console.log("gaugeData", gaugeData1);
      // const gaugeData = [
      //   {
      //     value: 20,
      //     name: "Perfect",
      //     title: {
      //       offsetCenter: ["0%", "-30%"],
      //     },
      //     detail: {
      //       valueAnimation: true,
      //       offsetCenter: ["0%", "-20%"],
      //     },
      //   },
      //   {
      //     value: 40,
      //     name: "Good",
      //     title: {
      //       offsetCenter: ["0%", "0%"],
      //     },
      //     detail: {
      //       valueAnimation: true,
      //       offsetCenter: ["0%", "10%"],
      //     },
      //   },
      //   {
      //     value: 60,
      //     name: "Commonly",
      //     title: {
      //       offsetCenter: ["0%", "30%"],
      //     },
      //     detail: {
      //       valueAnimation: true,
      //       offsetCenter: ["0%", "40%"],
      //     },
      //   },
      // ];
      // const dataOption = {
      //   series: [
      //     {
      //       type: "gauge",
      //       startAngle: 90,
      //       endAngle: -270,
      //       center: ["40%", "50%"],
      //       pointer: {
      //         show: false,
      //       },
      //       max: 200,
      //       progress: {
      //         show: true,
      //         overlap: false,
      //         roundCap: true,
      //         clip: false,
      //         itemStyle: {
      //           borderWidth: 1,
      //           borderColor: "#464646",
      //         },
      //       },
      //       axisLine: {
      //         lineStyle: {
      //           width: 100,
      //           // color: [[1, "#090d43"]],
      //         },
      //       },
      //       splitLine: {
      //         show: false,
      //         distance: 0,
      //         length: 10,
      //       },
      //       axisTick: {
      //         show: false,
      //       },
      //       axisLabel: {
      //         show: false,
      //         distance: 50,
      //       },
      //       data: gaugeData1,
      //       title: {
      //         fontSize: 10,
      //       },
      //       detail: {
      //         width: 20,
      //         height: 14,
      //         fontSize: 14,
      //         color: "auto",
      //         borderColor: "auto",
      //         borderRadius: 20,
      //         borderWidth: 1,
      //         formatter: "{value}%",
      //       },
      //       pointer: {
      //         show: false,
      //       },
      //     },
      //   ],
      // };
      const data = this.nowData.sort((a, b) => {
        return a.value - b.value;
      });
      const dataOption = {
        series: [
          {
            data,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    // startInterval() {
    //   if (this.timerId) {
    //     clearInterval(this.timerId);
    //   }
    //   this.timerId = setInterval(() => {
    //     this.currentPage++;
    //     if (this.currentPage > this.totalPage) {
    //       this.currentPage = 1;
    //     }
    //     this.updateChart();
    //   }, 3000);
    // },
    // 当浏览器的大小发生变化的时候, 会调用的方法, 来完成屏幕的适配
    screenAdapter() {
      // console.log(this.$refs.seller_ref.offsetWidth)
      const titleFontSize = (this.$refs.channel_ref.offsetWidth / 100) * 3.6;
      this.titleFontSize = titleFontSize;
      // 和分辨率大小相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
        series: [
          {
            label: {
              fontSize: this.titleFontSize / 2,
            },
            radius: [this.titleFontSize / 2, this.titleFontSize * 3],
            itemStyle: {
              borderRadius: this.titleFontSize / 5,
            },
          },
        ],
      };
      // const adapterOption = {
      // title: {
      //   textStyle: {
      //     fontSize: titleFontSize
      //   }
      // },
      // tooltip: {
      //   axisPointer: {
      //     lineStyle: {
      //       width: titleFontSize,
      //     },
      //   },
      // },
      // series: [
      //   {
      //     barWidth: titleFontSize,
      //     itemStyle: {
      //       barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
      //     },
      //   },
      // ],
      // };
      this.chartInstance.setOption(adapterOption);
      // 手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize();
    },
    handleSelect(currentType) {
      this.choiceType = currentType;
      // 变更数据
      this.nowData = this.allData[this.choiceType].data.sort((a, b) => {
        return a.value - b.value;
      });
      this.updateChart();
      this.showChoice = false;
    },
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
};
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 0.1rem;
  top: 0.1rem;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 0.125rem;
    cursor: pointer;
  }
  .select-con {
    background-color: #222733;
  }
}
</style>
