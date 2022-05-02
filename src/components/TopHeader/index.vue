<template>
  <div class="top-header">
    <!-- <div class="logo-text">
      <div class="cn-text">零售店铺数据大盘</div>
      <div class="en-text">Overview of Shop Data</div>
    </div>
    <div class="button-bar">
        bar
    </div> -->
    <div class="right-text">
      <div class="date">{{date}}</div>
      <div class="time">{{time}}</div>
    </div>
  </div>
</template>
<script>
  import { dateFilter, timeFilter } from '../../utils/clock'

  export default {
    data(){
        return {
            date: 1,
            time: 1,
            task: 0
        }
    },
    methods:{
        clock(){
            let now;
            this. task = setInterval(() => {
                now = new Date()
                this.date = dateFilter(now)
                this.time = timeFilter(now)
            }, 1000)
        }

    },
    mounted() {
        this.clock()
    },
    destroyed(){
        if(this.task){
            clearInterval(this.task)
        }
    }
    
    
  }
</script>

<style lang="less" scoped>
  .top-header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    background: rgb(36, 31, 32);
    box-sizing: border-box;
    justify-content: space-between;

    .logo-text {
      flex: 1;
      margin-left: 5%;

      .cn-text {
        color: rgb(255, 255, 255);
        font-weight: bold;
        font-size: 30px;
        letter-spacing: 2px;
      }

      .en-text {
        color: rgb(255, 255, 255);
        font-size: 15px;
        letter-spacing: 1px;
      }
    }

    .button-bar {
        flex:1
    }
    .right-text {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .date {
        width: 330px;
        text-align: right;
        font-size: 25px;
        color: rgb(255, 255, 255);
        font-family: DIN;
        font-weight: 500;
      }

      .time {
        width: 220px;
        font-size: 25px;
        color: rgb(197, 251, 121);
        font-family: DIN;
        font-weight: 500;
        margin-left: 30px;
      }
    }
  }
</style>
