<!-- 商家分布图表 -->
<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart-one" ref="map_ref"></div>
    <div class="com-chart-two" ref="rank_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
import { getShopMapInfo } from "@/utils/map_utils";
import { mapState } from "vuex";

export default {
  data() {
    return {
      chartInstance: null,
      chartRankInstance: null,
      allData: null,
      mapData: {}, // 所获取的省份的地图矢量数据
      mapValueData: {},
    };
  },
  created() {
    // 在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack("hotmapData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "hotmapData",
      chartName: "hotmap",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme);
      this.chartRankInstance = this.$echarts.init(
        this.$refs.rank_ref,
        this.theme
      );
      //获取店铺地图矢量数据
      const ret = await axios.get("hotmapjson");
      this.$echarts.registerMap("dianpu", ret.data);
      const initOption = {
        title: {
          text: "▎ 店铺实时人员热力图",
          left: 20,
          top: 12,
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>{c} (人)",
        },
        label: {
          show: false,
          fontSize: "40%",
          position: "top",
          offset: [30, 40],
          width: 10,
        },
        visualMap: {
          min: 0,
          max: 30,
          left: "0%",
          text: ["High", "Low"],
          realtime: false,
          calculable: true,
          itemWidth: "10%",
          itemHeight: "50%",
          inRange: {
            // color: ["white","red"]
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026",
            ],
            // color: ["lightskyblue", "yellow", "orangered","red"],
          },
        },
      };
      this.chartInstance.setOption(initOption);
      const initRankOption = {
        grid: {
          top: "10%",
          left: "5%",
          right: "13%",
          bottom: "15%",
          containLabel: true, // 距离是包含坐标轴上的文字
        },
        xAxis: {
          type: "value",
          axisLabel: {
            fontSize: "50%",
          },
        },
        yAxis: {
          type: "category",
          axisLabel: {
            rotate: 30,
            fontSize: "40%",
          },
        },
      };
      this.chartRankInstance.setOption(initRankOption);
      this.chartInstance.on("click", async (arg) => {
        // arg.name 得到所点击的区域, 这个区域他是中文
        const shopPartInfo = getShopMapInfo(arg.name);
        // 判断当前所点击的这个区域的地图矢量数据在mapData中是否存在
        if (!this.mapData[shopPartInfo.key]) {
          const ret = await axios.get(shopPartInfo.path);
          this.mapData[shopPartInfo.key] = ret.data;
          this.$echarts.registerMap(shopPartInfo.key, ret.data);
        }
        const dataItem = this.allData.find((item) => {
          return item.name === arg.name;
        });
        const changeOption = {
          series: [
            {
              type: "map",
              label: {
                show: true,
              },
              map: shopPartInfo.key,
              data: dataItem.children || [],
            },
          ],
        };
        this.chartInstance.setOption(changeOption);
        const dataSortArr = dataItem.children.sort((a, b) => {
          return a.value - b.value;
        });
        const rankKeyArr = dataSortArr.map((item) => {
          return item.name;
        });
        const rankValueArr = dataSortArr.map((item) => {
          return item.value;
        });
        const changeRankOption = {
          yAxis: {
            data: rankKeyArr,
          },
          series: [
            {
              type: "bar",
              data: rankValueArr,
              barCategoryGap: "50%",
              itemStyle: {
                color: "lightblue",
                // barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
              },
            },
          ],
        };
        this.chartRankInstance.setOption(changeRankOption);
      });
    },
    async getData(ret) {
      //获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表;
      // const { data: ret } = await this.$http.get("hotmapdata");
      this.allData = ret.data;
      console.log("all", this.allData);
      this.updateChart();
    },
    updateChart() {
      // 处理图表需要的数据
      // 图例的数据
      //   const legendArr = this.allData.map(item => {
      //     return item.name
      //   })
      //   const seriesArr = this.allData.map(item => {
      //     // return的这个对象就代表的是一个类别下的所有散点数据
      //     // 如果想在地图中显示散点的数据, 我们需要给散点的图表增加一个配置, coordinateSystem:geo
      //     return {
      //       type: 'effectScatter',
      //       rippleEffect: {
      //         scale: 5,
      //         brushType: 'stroke'
      //       },
      //       name: item.name,
      //       data: item.children,
      //       coordinateSystem: 'geo'
      //     }
      //   })
      //   const dataOption = {
      //     legend: {
      //       data: legendArr
      //     },
      //     series: seriesArr
      //   }
      const dataOption = {
        // legend: {
        //   data: legendArr
        // },
        series: [
          {
            // name: '地图',
            type: "map",
            label: {
              show: true,
              fontSize: "50%",
            },
            left: "15%",
            map: "dianpu",
            showLegendSymbol: false,
            data: this.allData,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
      const sortAllData = this.allData.sort((a, b) => {
        return a.value - b.value;
      });
      console.log("ssss", sortAllData);
      let rankKeyArr = sortAllData.map((item) => {
        return item.name;
      });
      let rankValueArr = this.allData.map((item) => {
        return item.value || 0;
      });
      const rankOption = {
        yAxis: {
          data: rankKeyArr,
        },
        series: [
          {
            type: "bar",
            data: rankValueArr,
            barCategoryGap: "50%",
            itemStyle: {
              color: "lightblue",
              // barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      };
      console.log("rankValueArr", rankValueArr);
      console.log("rankKeyArr", rankKeyArr);
      this.chartRankInstance.setOption(rankOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
        visualMap: {
          itemWidth: titleFontSize / 1.5,
          itemHeight: titleFontSize * 4,
        },
        series: [
          {
            // // name: '地图',
            // type: "map",
            label: {
              show: true,
              // fontSize: titleFontSize / 1.5,
            },
            // map: "dianpu",
            // showLegendSymbol: false,
            // data: this.allData,
          },
        ],
      };
      const rankAdapterOption = {
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
            // barWidth: titleFontSize / 2,
            barCategoryGap: "50%",
            itemStyle: {
              color: "lightblue",
              // barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      };
      this.chartRankInstance.setOption(rankAdapterOption);
      this.chartRankInstance.resize();
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    // 回到商铺地图
    revertMap() {
      // const revertOption = {
      //   series: [
      //     {
      //       type: "map",
      //       label: {
      //         show: true,
      //       },
      //       map: "dianpu",
      //       data: this.allData,
      //     },
      //   ],
      // };
      // this.chartInstance.setOption(revertOption);
      this.updateChart();
    },
  },
  computed: {
    ...mapState(["theme"]),
  },
  watch: {
    theme() {
      console.log("主题切换了");
      this.chartInstance.dispose(); // 销毁当前的图表
      this.chartRankInstance.dispose(); //销毁当前的图表
      this.initChart(); // 重新以最新的主题名称初始化图表对象
      this.$socket.send({
        action: "getData",
        socketType: "hotmapData",
        chartName: "hotmap",
        value: "",
      });
      this.screenAdapter(); // 完成屏幕的适配
      this.updateChart(); // 更新图表的展示
    },
  },
};
</script>

<style lang='less' scoped>
.com-container {
  display: flex;
}
.com-chart-one {
  flex: 1.5;
  height: 100%;
}
.com-chart-two {
  flex: 1;
  height: 100%;
}

canvas {
  border-radius: 0.1rem;
}
</style>