<template>
  <div
    class="screen-container"
    ref="screen"
    :style="containerStyle"
    :class="[fullScreenStatus.screen ? 'fullscreen' : '']"
  >
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="">
      </div>
      <!-- <span class="logo">
          111
        <img :src="logoSrc" alt="" />
      </span> -->
      <span class="title">零售店铺数据大屏</span>
      <!-- <div class="title-right"> -->
      <div class="resize">
        <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme" />
        <span class="datetime">
          {{ date }}  {{ time }}
        </span>
        <span
          @click="changeSize('screen')"
          :class="[
            'iconfont',
            fullScreenStatus.screen ? 'icon-compress-alt' : 'icon-expand-alt',
          ]"
        ></span>
      </div>
      <!-- </div> -->
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div
          id="left-top"
          :class="[fullScreenStatus.averageage ? 'fullscreen' : '']"
        >
          <average-age ref="averageage" />
          <!-- 销量趋势图表 -->
          <!-- <Trend ref="trend"></Trend> -->
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('averageage')"
              :class="[
                'iconfont',
                fullScreenStatus.averageage
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div
          id="left-middle"
          :class="[fullScreenStatus.channel ? 'fullscreen' : '']"
        >
          <channel ref="channel" />
          <!-- 商家销售金额图表 -->
          <!-- <Seller ref="seller"></Seller>
          <div class="resize"> -->
          <!-- icon-compress-alt -->
          <!-- <span @click="changeSize('seller')"  :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div> -->
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('channel')"
              :class="[
                'iconfont',
                fullScreenStatus.channel
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div
          id="left-bottom"
          :class="[fullScreenStatus.staff ? 'fullscreen' : '']"
        >
          <staff ref="staff" />
          <!-- 商家销售金额图表 -->
          <!-- <Seller ref="seller"></Seller>
          <div class="resize"> -->
          <!-- icon-compress-alt -->
          <!-- <span @click="changeSize('seller')"  :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div> -->
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('staff')"
              :class="[
                'iconfont',
                fullScreenStatus.staff
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div
          id="middle-top"
          :class="[fullScreenStatus.hotmap ? 'fullscreen' : '']"
        >
          <hot-map ref="hotmap" />
          <!-- 商家分布图表 -->
          <!-- <Map ref="map"></Map>
          <div class="resize"> -->
          <!-- icon-compress-alt -->
          <!-- <span @click="changeSize('map')"  :class="['iconfont', fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']"></span> -->
          <!-- </div> -->
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('hotmap')"
              :class="[
                'iconfont',
                fullScreenStatus.hotmap
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div
          id="middle-bottom"
          :class="[fullScreenStatus.trend ? 'fullscreen' : '']"
        >
          <trend ref="trend" />
          <!-- 地区销量排行图表 -->
          <!-- <Rank ref="rank"></Rank> -->
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('trend')"
              :class="[
                'iconfont',
                fullScreenStatus.trend
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div
          id="right-top"
          :class="[fullScreenStatus.hotproduct ? 'fullscreen' : '']"
        >
          <hot-product ref="hotproduct" />
          <!-- 热销商品占比图表 -->
          <!-- <Hot ref="hot"></Hot>
          <div class="resize"> -->
          <!-- icon-compress-alt -->
          <!-- <span @click="changeSize('hot')"  :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div> -->
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('hotproduct')"
              :class="[
                'iconfont',
                fullScreenStatus.hotproduct
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div
          id="right-bottom"
          :class="[fullScreenStatus.stock ? 'fullscreen' : '']"
        >
          <stock ref="stock" />
          <!-- 库存销量分析图表 -->
          <!-- <Stock ref="stock"></Stock>
          <div class="resize"> -->
          <!-- icon-compress-alt -->
          <!-- <span @click="changeSize('stock')"  :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div> -->
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('stock')"
              :class="[
                'iconfont',
                fullScreenStatus.stock
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import AverageAge from "@/components/NormalVirtual/AverageAge.vue";
import Staff from "@/components/NormalVirtual/Staff.vue";
import Trend from "@/components/NormalVirtual/Trend.vue";
import HotProduct from "@/components/NormalVirtual/HotProduct.vue";
import Stock from "@/components/NormalVirtual/Stock.vue";
import HotMap from "@/components/NormalVirtual/HotMap.vue";
import Channel from "@/components/NormalVirtual/Channel.vue";
// import Hot from '@/components/Hot.vue'
// import Map from '@/components/Map.vue'
// import Rank from '@/components/Rank.vue'
// import Seller from '@/components/Seller.vue'
// import Stock from '@/components/Stock.vue'
// import Trend from '@/components/Trend.vue'
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
import { dateFilter, timeFilter } from "@/utils/clock";
export default {
  //   created () {
  //     // 注册接收到数据的回调函数
  //     this.$socket.registerCallBack('fullScreen', this.recvData)
  //     this.$socket.registerCallBack('themeChange', this.recvThemeChange)
  //   },
  //   destroyed () {
  //     this.$socket.unRegisterCallBack('fullScreen')
  //     this.$socket.unRegisterCallBack('themeChange')
  //   },
  data() {
    return {
      //时间数据
      // nowTime: {
        date: 1,
        time: 1,
        task: 0,
      // },
      // 定义每一个图表的全屏状态
      fullScreenStatus: {
        screen: false,
        averageage: false,
        channel: false,
        staff: false,
        hotmap: false,
        trend: false,
        hotproduct: false,
        stock: false,
      },
    };
  },
  created() {
    this.$socket.registerCallBack("fullScreen", this.recvData);
    this.$socket.registerCallBack("themeChange", this.recvThemeChange);
  },
  mounted() {
    this.clock();
  },
  destroyed() {
    this.$socket.unRegisterCallBack("fullScreen");
    this.$socket.unRegisterCallBack("themeChange");
    if (this.task) {
      clearInterval(this.task);
    }
  },
  methods: {
    clock() {
      let now;
      this.task = setInterval(() => {
        now = new Date();
        this.date = dateFilter(now);
        this.time = timeFilter(now);
      }, 1000);
    },
    // handleChangeScreen(screenName) {
    //   this.fullScreenStatus[screenName] = !this.fullScreenStatus[screenName];
    //   //  Object.keys(this.fullScreenStatus).forEach(chartName => {
    //   //    this.$refs[chartName].screenAdapter()
    //   //  });
    //   // this.$refs["trend"].screenAdapter();
    //   // console.log('1111')
    //   this.$nextTick(() => {
    //     Object.keys(this.fullScreenStatus).forEach((chartName) => {
    //       if (chartName !== "screen") {
    //         this.$refs[chartName].screenAdapter();
    //       }
    //     });
    //   });
    // },
    changeSize(chartName) {
      // 1.改变fullScreenStatus的数据
      // this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName];
      // 2.需要调用每一个图表组件的screenAdapter的方法
      // this.$refs[chartName].screenAdapter();
      // this.$nextTick(() => {
      //   this.$refs[chartName].screenAdapter();
      // });
      // 将数据发送给服务端
      const targetValue = !this.fullScreenStatus[chartName];
      this.$socket.send({
        action: "fullScreen",
        socketType: "fullScreen",
        chartName: chartName,
        value: targetValue,
      });
    },
    // 接收到全屏数据之后的处理
    recvData(data) {
      // 取出是哪一个图表需要进行切换
      const chartName = data.chartName;
      // 取出, 切换成什么状态
      const targetValue = data.value;
      this.fullScreenStatus[chartName] = targetValue;
      // this.$nextTick(() => {
      //   this.$refs[chartName].screenAdapter()
      // })
      this.$nextTick(() => {
        Object.keys(this.fullScreenStatus).forEach((chartName) => {
          if (chartName !== "screen") {
            this.$refs[chartName].screenAdapter();
          }
        });
      });
    },
    handleChangeTheme() {
      // 修改VueX中数据
      // this.$store.commit('changeTheme')
      this.$socket.send({
        action: "themeChange",
        socketType: "themeChange",
        chartName: "",
        value: "",
      });
    },
    recvThemeChange() {
      this.$store.commit("changeTheme");
    },
  },
  components: {
    AverageAge,
    Staff,
    Trend,
    HotProduct,
    Stock,
    HotMap,
    Channel,
    // Hot,
    // Map,
    // Rank,
    // Seller,
    // Stock,
    // Trend
  },
  computed: {
    logoSrc() {
      return "/static/img/" + getThemeValue(this.theme).logoSrc;
    },
    headerSrc() {
      return "/static/img/" + getThemeValue(this.theme).headerBorderSrc;
    },
    themeSrc() {
      return "/static/img/" + getThemeValue(this.theme).themeSrc;
    },
    containerStyle() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor,
      };
    },
    ...mapState(["theme"]),
  },
};
</script>
<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 0.25rem;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 0.8rem;
  font-size: 0.25rem;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 0.25rem;
    transform: translate(-50%, -50%);
  }
  .title-right {
    width: 3.75rem;
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    background-color: aqua;
    transform: translateY(-80%);
  }
  .qiehuan {
    margin-right: 0.125rem;
    width: 0.35rem;
    height: 0.2625rem;
    cursor: pointer;
  }
  .datetime {
    margin-right: 0.125rem;
    font-size: 0.1875rem;
    margin-left: 0.125rem;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 0.4375rem;
      width: 1.6rem;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 0.125rem;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      background-color: #fff;
      height: 25%;
      position: relative;
    }
    #left-middle {
      background-color: #fff;
      height: 25%;
      margin-top: 0.3125rem;
      position: relative;
    }
    #left-bottom {
      background-color: #fff;
      height: 30%;
      margin-top: 0.3125rem;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      background-color: #fff;
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      background-color: #fff;
      margin-top: 0.3125rem;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      background-color: #fff;
      height: 46%;
      position: relative;
    }
    #right-bottom {
      background-color: #fff;
      height: 38%;
      margin-top: 0.3125rem;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 0.25rem;
  top: 0.25rem;
  cursor: pointer;
}
</style>

