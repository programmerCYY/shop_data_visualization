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
    <div class="com-chart" ref="staff_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
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
      choiceType: "time", // 显示的数据类型
      titleFontSize: 0, // 指明标题的字体大小
    };
  },
  created() {
    // 在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack("staffData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData()
    this.$socket.send({
      action: "getData",
      socketType: "staffData",
      chartName: "staff",
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
        fontSize: this.titleFontSize + "px",
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
    ...mapState(["theme"]),
  },
  methods: {
    // 初始化echartInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.staff_ref, this.theme);
      // 对图表初始化配置的控制
      const initOption = {
        grid: {
          top: "20%",
          left: "3%",
          right: "10%",
          bottom: "3%",
          containLabel: true, // 距离是包含坐标轴上的文字
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              color: "#2D3443",
            },
          },
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            itemStyle: {
              // 指明颜色渐变的方向
              // 指明不同百分比之下颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 百分之0状态之下的颜色值
                {
                  offset: 0,
                  color: "#5052EE",
                },
                // 百分之100状态之下的颜色值
                {
                  offset: 1,
                  color: "#AB6EE5",
                },
              ]),
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
      // const { data: ret } = await this.$http.get('staff')
      this.allData = ret.data;
      // 获取当前分类数据
      this.nowData = this.allData[this.choiceType].data.sort((a, b) => {
        return a.value - b.value;
      });
      // 每5个元素显示一页
      this.totalPage =
        this.nowData.length % 5 === 0
          ? this.nowData.length / 5
          : this.nowData.length / 5 + 1;
      // 按页更新图表数据
      this.updateChart();
      // 启动定时器
      this.startInterval();
    },
    // 更新图表
    updateChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.nowData.slice(start, end);
      const sellerNames = showData.map((item) => {
        return item.name;
      });
      const sellerValues = showData.map((item) => {
        return item.value;
      });
      const dataOption = {
        xAxis: {
          name: "/" + this.allData[this.choiceType].unit,
        },
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValues,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateChart();
      }, 3000);
    },
    // 当浏览器的大小发生变化的时候, 会调用的方法, 来完成屏幕的适配
    screenAdapter() {
      // console.log(this.$refs.seller_ref.offsetWidth)
      const titleFontSize = (this.$refs.staff_ref.offsetWidth / 100) * 3.6;
      this.titleFontSize = titleFontSize;
      // 和分辨率大小相关的配置项
      const adapterOption = {
        xAxis: {
          nameTextStyle: {
            fontSize: titleFontSize / 2,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      };
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
      this.totalPage =
        this.nowData.length % 5 === 0
          ? this.nowData.length / 5
          : this.nowData.length / 5 + 1;
      this.currentPage = 1;
      this.updateChart();
      this.showChoice = false;
    },
  },
  watch: {
    theme() {
      console.log("主题切换了2");
      this.chartInstance.dispose(); // 销毁当前的图表
      this.initChart(); // 重新以最新的主题名称初始化图表对象
      this.screenAdapter(); // 完成屏幕的适配
      this.updateChart(); // 更新图表的展示
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 0.18rem;
  top: 0.18rem;
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
