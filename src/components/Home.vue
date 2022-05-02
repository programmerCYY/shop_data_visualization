<template>
    <el-container class="home-container">
    <el-header>
        <div>
            <span>零售大屏管理系统</span>
        </div>
        <el-menu
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router = "true"
            default-active = "/data_virtual">
            <el-menu-item :index="'/' + item.path" v-for="item in menuList" :key="item.id">
                <template slot="title">
                    <!-- 文本 -->
                    <span>{{ item.authName }}</span>
                </template>
            </el-menu-item>
       </el-menu>
    <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-main>
        <router-view></router-view>
    </el-main>
    </el-container>
</template>
<script>
export default{
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
    created() {
        this.getMenuList()
    },
    methods:{
        logout() {
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        async getMenuList() {
           const {data: res} = await this.$http.get('menus')
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menuList = res.data
            console.log('res.data', res.data)
        }
    }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-main{
  background-color:#eaedf1;
}



</style>
