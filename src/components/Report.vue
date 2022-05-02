<template>
    <div class="container">
        <div id="header">
            <top-header/>
        </div>
        <div id="body">
            <div id="left">
                <div id="left1">
                    <total-sell/>
                </div>
                <div id="left2">
                    <average-age/>
                    left2
                </div>
                <div id="left3">
                    left3
                </div>
                <div id="left4">
                    left4
                </div>
                <div id="left5">
                    left5
                </div>                 
            </div>
            <div id="right">
                <div id="right-head">
                    <center-header/>
                </div>
                <div id="right-body">
                    <div id="right-body-top">
                        <div id="right-body-top-1">
                            right-body-top-1
                        </div>
                        <div id="right-body-top-2">
                            right-body-top-2
                        </div>
                    </div>
                    <div id="right-body-bottom">  
                        <div id="right-body-bottom-1">
                            right-body-bottom-1
                        </div>
                        <div id="right-body-bottom-2">
                            right-body-bottom-2
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TopHeader from './TopHeader/index'
import CenterHeader from './CenterHeader/index'
import TotalSell from './TotalSell/index'
// import AverageAge from './AverageAge/index'
export default{
    components:{
        TopHeader,
        CenterHeader,
        TotalSell
        // AverageAge
    }
}
</script>

<style lang="less" scoped>
 .container {
    width: 100%;
    height: 100%;
    // overflow: hidden;
    // background-color: rgb(50, 47, 48);
    background: rgb(29, 29, 29);
    color: #fff;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    #header {
        flex: 1;
        background-color: aqua;
    }
    #body{
        flex: 10;
        background-color: rgb(219, 36, 36);  
        display: flex;
        #left{
            flex: 1.2;
            background-color: wheat;
            display: flex;
            // overflow: hidden;
            flex-direction: column;
            #left1, #left2, #left3, #left4, #left5 {
            flex:1;
            margin-bottom: 10px;
            background: rgb(56, 73, 124);
          }
        }
        #right{
            flex:5;
            display: flex;
            flex-direction: column;
            #right-head{
                flex:1;
                background: rgb(224, 140, 38);
            }
            #right-body{
                flex:8;
                background: rgb(204, 223, 38);
                display: flex;
                flex-direction: column;
                #right-body-top{
                    flex:1.5;
                    display: flex;
                    background: rgb(43, 38, 31);
                    #right-body-top-1, #right-body-top-2{
                        margin:10px 10px;
                        background: rgb(29, 164, 181);
                    }
                    #right-body-top-1{
                        flex: 1.5;
                    }
                     #right-body-top-2{
                        flex: 1;
                    }
                }
                #right-body-bottom{
                    flex:1;
                    display: flex;
                    background: rgb(98, 57, 7);
                    #right-body-bottom-1, #right-body-bottom-2{
                        margin:10px 10px;
                        background: rgb(29, 164, 181);
                    }
                    #right-body-bottom-1{
                        flex: 1.5;
                    }
                     #right-body-bottom-2{
                        flex: 1;
                    }
                }
            }
        }
    }

 }
</style>