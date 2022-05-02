<template>
  <div class="total-user">
    <div class="title">商店总销售额</div>
    <div class="sub-title">Sell Total Count</div>
    <div class="total">
      <count-to
        :start-val="startVal"
        :end-val="todayUser"
        :duration="1000"
        separator=","
        autoplay
      />
    </div>
    <div class="percent-text">
        <span class="percent-text-1">
          每日增长率:
          <count-to
            :start-val="startPercent"
            :end-val="growthLastDay"
            :duration="1000"
            :decimals="2"
            suffix="%"
          />
        </span>
      <span class="percent-text-2">
        每月增长率:
        <count-to
          :start-val="startPercent2"
          :end-val="growthLastMonth"
          :duration="1000"
          :decimals="2"
          suffix="%"
        />
        </span>
    </div>
    <div class="percent">
      <div class="percent-inner-wrapper">
        <div class="percent-inner" :style="{width: `${growthLastDay}%`}" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      todayUser: Number,
      growthLastDay: {
        type: Number,
        default: 0
      },
      growthLastMonth: {
        type: Number,
        default: 0
      }
    },
    data(){
      return{
        startVal:0,
        startPercent:0,
        startPercent2:0
      }
    },
    methods:{
      updateStartVal () {
        this.startVal = this.todayUser
        this.startPercent = this.growthLastDay
        this.startPercent2 = this.growthLastMonth
      }
    }
  }
</script>

<style lang="less" scoped>
  .total-user {
    width: 100%;
    height: 100%;
    background: rgb(66, 68, 70);
    box-shadow: 0 10px 10px rgba(0, 0, 0, .3);
    padding: 10px 20px;
    box-sizing: border-box;
    margin: 2px, 2px;

    .title {
      font-size: 20px;
    }

    .sub-title {
      font-size: 10px;
      letter-spacing: 1px;
      margin-top: 5px;
    }

    .total {
      font-family: DIN;
      font-size: 25px;
      font-weight: bolder;
      letter-spacing: 2px;
      padding: 5px 0;
    }

    .percent-text {
      font-size: 10px;
      font-family: DIN;
      letter-spacing: 2px;

      .percent-text-1 {
        color: rgb(197, 251, 121);
      }

      .percent-text-2 {
        color: rgb(99, 169, 0);
        margin-left: 10px;
      }
    }

    .percent {
      width: 100%;
      height: 10px;
      box-sizing: border-box;
      border: 1px solid #fff;
      margin-top: 10px;

      .percent-inner-wrapper {
        height: 100%;
        padding: 2px;
        box-sizing: border-box;
        overflow: hidden;

        .percent-inner {
          height: 100%;
          background: rgb(150, 150, 150);
          transition: all 1s linear;
        }
      }
    }
  }
</style>
