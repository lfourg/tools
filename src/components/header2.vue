<template>
  <div class="navbar">
    <div class="logo">
      <router-link to="/"><i class="icon iconfont icon-icp-acitve-spline"></i><span>charts</span></router-link>
    </div>
    <ul>
      <li v-for="menu in menus" :class="[menu.flag==currMenu.flag?'active':'']">
        <router-link :to="menu.url"><i :class="['icon','iconfont',menu.icon]"></i>{{menu.name}}</router-link>
      </li>
    </ul>
    <div class="block-bar-right">
      <div class="search">
        <Search></Search>
      </div>
      <div class="operation">        
        <div v-if="!isLogin" class="com-item user"><a @click="login">登录</a></div>
        <div v-else class="com-item user">
          <img class='my-icon' :src='iconBase64'/>
        <i class="icon iconfont icon-sanjiaoxing-down"></i>
          <div class="item">
            <div class="chi-item">
              <router-link to="/user"><i class="icon iconfont icon-user"></i>个人中心</router-link>
            </div>
            <div class="chi-item" @click="exit"><a><i class="icon iconfont icon-tuichu2"></i>退出</a></div>
          </div>
        </div>
        <div v-if="chartPage" class="com-item add-chart"><a @click="add"><i class="icon iconfont icon-tianjia2"></i>新增</a></div>
      </div>
    </div>

  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import Search from './search.vue'
  import Identicon from 'identicon.js'

  export default{
    name: 'HeaderBar',
    props:['chartPage'],
    computed: {
      ...mapGetters({
        currMenu: 'getCurrMenu',
        menus: 'getMenus',
        isLogin: 'getIsLogin',
        user: 'getUser'
      })
    },
    components: {
      Search
    },
    data(){
      return {
        iconBase64:'',
        iconOptions: {
            foreground: [255,255,255],               // rgba black
            background: [70,77,81],         // rgba white
            margin: 0.2,                              // 20% margin
            size: 25,                                // 420px square
            format: 'svg'                             // use SVG instead of PNG
          }
      }
    },
    mounted(){
      this.init();
    },
    methods: {
      init: function () {
          this.setIcon();
      },
      add:function () {
        if(this.isLogin) 
          this.$emit("handleAdd");
        else
          this.$store.dispatch("setLoginDialogState", true);  
      },
      setIcon(){
        if(this.isLogin && this.user._id) {
          let data = new Identicon(this.user._id, this.iconOptions).toString();
          this.iconBase64='data:image/svg+xml;base64,' + data ;
        }
      },
      login: function () {
        this.$store.dispatch("setLoginDialogState", true);
      },
      exit: function () {
        localStorage.removeItem('currUser');
        this.$router.push('/')
        this.$store.dispatch("setMenus", false);
        this.$store.dispatch("setUser", null);
      }
    },
    watch:{
      isLogin(){
        this.setIcon();
      }
    }
  }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .operation {
    .com-item {
      width: 80px;
      height: 100%;
      float: right;
      a {
        color: #fff;
        display: inline-block;
        width:100%;
        height: 100%;
      }
    }
    .add-chart {
      background: $red;
      -webkit-transition: all .3s;
      -moz-transition: all .3s;
      -ms-transition: all .3s;
      -o-transition: all .3s;
      transition: all .3s;
      &:hover{
        background: $red2;
      }
      i{
        margin-right: 3px;
        color: #fff;
      }
      a{
        width:100%;
        height: 100%;
        display: block;
      }
    }
    .user {
      .my-icon{
        margin-top: 12px;
        margin-right: 15px;
        width: 25px;
        height: 25px;
        border-radius: 5px;
      }
      >a {
        &:hover {
          color: $red;
        }
      }
      >i{
        color: rgba(255, 255, 255, .5);
      }
      &:hover{
        .item {
          height: 80px;
        }
        >i {
          color: $white !important;
        }
      }
      .icon-sanjiaoxing-down {
        position: absolute;
        right: 15px;
        font-size: 12px !important;
      }
    }
    .item {
      width: 160px;
      top: 53px;
      right: 0px;
      height: 0;
      position: fixed;
      border-radius: 0 0 5px 5px;
      /*box-shadow: 0px 2px 6px 0px #f2f2f2;*/
      -webkit-transition: height .3s;
      -moz-transition: height .3s;
      -ms-transition: height .3s;
      -o-transition: height .3s;
      transition: height .3s;
      overflow: hidden;
      margin-top:-4px;
      .chi-item {
        height: 40px;
        line-height: 40px;
        background: #373d41;
        color: rgba(255, 255, 255, 0.5);
        a {
          color: rgba(255, 255, 255, 0.5);
          display: block;
          text-align: left;
          padding-left: 22px;
          transition: color .3s;
          i{
            margin-right: 8px;
          }
          &:hover{
            color: $red;
          }
        }
      }
    }
  }

  .navbar {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border: none;
    background-color: $darkGrey;
    color: $white;
    position: fixed;
    top: 0;
    z-index: 1100;
    border-bottom: 4px solid $fontActive;
    .logo {
      float: left;
      width: 160px;
      i {
        font-size: 26px;
        margin: 0 5px 0 10px;
        color: #00c1de;
        font-weight: bold;
      }
      a {
        color: #fff;
        font-size: 16px;
        font-family: fantasy;
        span {
          vertical-align: 3px;
        }
      }
    }
    ul {
      display: inline-block;
      li {
        display: inline-block;
        padding: 0px 20px;
        position: relative;
        transition: all .3s;
        &:hover, &.active {
          background: $darkGrey3;
          a{
            color:$red;
          }
        }
        &:before {
          content: '';
          position: absolute;
          left: 50%;
          right: 50%;
          top: 0;
          background: $red;
          height: 0px;
          -webkit-transition-property: 'left, right';
          transition-property: 'left, right';
          -webkit-transition-duration: .3s;
          transition-duration: .3s;
          -webkit-transition-timing-function: ease-out;
          transition-timing-function: ease-out;
        }
        &:hover:before, &.active:before {
          left: 0;
          right: 0;
        }
        a {
          color: $white;
          display: block;
          width: 100%;
          height: 50px;
          transition: all .3s;
          i {
            margin-right: 5px;
          }
        }
      }
    }
    .block-bar-right {
      height: 100%;
      line-height: 100%;
      right: 15px;
      float: right;
      > div {
        display: inline-block;
        position: relative;
        color: $white;
        min-width: 60px;
        width: auto;
        height: 100%;
        line-height: 50px;
        text-align: center;
        float: left;
        cursor: pointer;
        i {
          &:hover {
            color: $white;
          }
        }
      }
      .search {
      }
    }
  }

</style>
