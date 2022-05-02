<template>
  <div class="com-container">
    <div class="title-wrapper">
      <div class="left" :style="comStyle">
        <div class="title" :style="comStyle">店铺客户年龄分布&平均年龄</div>
        <div class="sub-title" :style="comSubTitleStyle">
          Distribution of Age
        </div>
      </div>
      <div class="right" :style="comStyle">
        <div class="age" :style="comStyle">
          <count-to
            :startVal="startAge"
            :endVal="allData.averageAge"
            :duration="1000"
            :decimals="2"
          />
          <span class="age-unit" :style="comStyle">岁</span>
        </div>
      </div>
    </div>
    <div class="average-data-wrapper">
      <div
        class="average-data"
        v-for="(item, index) in allData.age"
        :key="index"
        :style="comMargin"
      >
        <div class="average-data-tab" :style="comSubTitleStyle">
          {{ item.name }}
        </div>
        <div class="average-data-value" :style="comSubTitleStyle">
          <count-to
            :startVal="startAge"
            :endVal="item.value"
            :duration="1000"
          />
        </div>
      </div>
    </div>
    <div class="com-chart" ref="user_age"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
export default {
  data() {
    return {
      startAge: 0,
      titleFontSize: 0,
      chartInstance: null, //echarts实例对象
      allData: [], //服务器获取所有数据
    };
  },
  created() {
    // 在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack("userageData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "userageData",
      chartName: "userage",
      value: "",
    });    
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  computed: {
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color: getThemeValue(this.theme).titleColor
      };
    },
    comSubTitleStyle() {
      return {
        fontSize: this.titleFontSize / 2 + "px",
        color: getThemeValue(this.theme).titleColor
      };
    },
    comMargin() {
      return {
        marginLeft: this.titleFontSize * 3 + "px",
        color: getThemeValue(this.theme).titleColor
      };
    },
    ...mapState(['theme'])
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.user_age, this.theme);
      //初始化图表配置项，和数据无关
      const initOption = {
        grid: {
          height: "10%",
          left: "5%",
          right: "5%",
          top: "60%",
        },
        legend: {
          left: "center",
          top: "80%",
          icon: "circle",
          itemGap: 200,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          textStyle: {
            fontSize: 28,
          },
          padding: 10,
        },
        xAxis: {
          type: "value",
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: "rgb(50,51,53)",
              width: 3,
            },
          },
          axisTick: { show: false },
          axisLabel: {
            color: "rgb(98,105,113)",
            fontSize: 18,
          },
        },
        yAxis: {
          type: "category",
          show: false,
        },
        series: [
          {
            type: "bar",
            stack: "total",
            barWidth: 15,
          },
          {
            type: "bar",
            stack: "total",
            barWidth: 15,
          },
          {
            type: "bar",
            stack: "total",
            barWidth: 15,
          },
          {
            type: "bar",
            stack: "total",
            barWidth: 15,
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData(res) {
      // const { data: res } = await this.$http.get("user_age");
      this.allData = res.data;
      this.updateChart();
    },
    updateChart() {
      const userAgeArr = this.allData.age.map((item) => {
        return {
          name: item.name,
          data: [item.value],
        };
      });
      const dataOption = {
        xAxis: {
          max: this.allData.allUserNumber,
        },
        yAxis: {
          data: ["年龄分布"],
        },
        series: userAgeArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.user_age.offsetWidth / 100) * 3.6;
      const adpaterOption = {
        tooltip: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              width: this.titleFontSize / 5,
            },
          },
          axisLabel: {
            fontSize: this.titleFontSize / 1.5,
          },
        },
        legend: {
          itemWidth: this.titleFontSize / 1.5,
          itemHeight: this.titleFontSize / 1.5,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adpaterOption);
      this.chartInstance.resize();
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
.com-container {
  width: 100%;
  height: 100%;
  // background: rgb(43, 44, 46);
  // padding: .25rem .5rem;
  box-sizing: border-box;

  // .wrapper{}
  .title-wrapper {
    position: absolute;
    top: 3%;
    left: 10%;
    right: 10%;
    z-index: 10;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 0.5rem;

    .left {
      .title {
        font-size: 0.8rem;
      }

      .sub-title {
        font-size: 0.4rem;
        margin-top: 0.125rem;
      }
    }

    .right {
      flex: 1;
      margin-left: 0.5rem;
      font-weight: bold;

      .age {
        font-size: 1.7rem;
        font-family: DIN;

        .age-unit {
          font-size: 0.5rem;
        }
      }
    }
  }

  #average-age-chart {
    height: 120px;
  }

  .average-data-wrapper {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, 0);
    display: flex;
    justify-content: center;
    color: white;
    z-index: 10;

    .average-data {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      // justify-content: center;
      margin-left: 10%;
      font-size: 0.7rem;
      font-weight: bolder;
      .average-data-tab {
        font-size: 0.35rem;
      }
      .average-data-value {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }
    }
  }
}
</style>