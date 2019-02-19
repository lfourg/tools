<template>
  <div>
    <HeaderBar></HeaderBar>
    <div class="left-bar">
      <ul>
        <el-tooltip v-for="item in menus" class="item" effect="dark" :key="item.flag" :content="item.name"
                    placement="right">
          <li :class="[currentView===item.flag?'active':'']" @click="changeMenu(item)">
            <i :class="['icon','iconfont',item.icon]"></i>
          </li>
        </el-tooltip>
      </ul>
    </div>
    <div class="right-page">
      <component v-bind:is="currentView">
        <!-- 组件在 vm.currentview 变化时改变！ -->
      </component>
    </div>
  </div>
</template>
<script>
  import HeaderBar from '../components/header2'
  import BaseInfo from './user/baseInfo'
  import UserPwd from './user/pwd'
  import Project from './project/index'
  export default{
    name: 'user',
    data(){
      return {
        currentView: 'BaseInfo',
        menus: [
          {name: '用户基本信息', flag: 'BaseInfo', icon: 'icon-yonghu1'},
          {name: '修改密码', flag: 'UserPwd', icon: 'icon-mima'},
          {name: '我的项目', flag: 'Project', icon: 'icon-xiangmu'}
        ]
      }
    },
    components: {
      BaseInfo, UserPwd, Project,HeaderBar
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){
        this.$store.dispatch("setCurrMenu", {flag: ''});
      },
      changeMenu(item){
        this.currentView = item.flag;
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  .left-bar {
    width: 50px;
    height: 100%;
    background: $darkGrey;
    position: fixed;
    top: 54px;
    ul {
      li {
        width: 100%;
        height: 55px;
        line-height: 55px;
        text-align: center;
        cursor: pointer;
        position: relative;
        &:before {
          content: '';
          position: absolute;
          left: 50%;
          right: 50%;
          top: 53px;
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
        i {
          font-size: 16px;
          color: $white;
        }
        &:hover, &.active {
          background: $darkGrey3;
          i{
            color:$red;
          }
        }
      }
    }

  }

  .right-page {
    top: 54px;
    left: 50px;
    right: 0;
    bottom: 0;
    position: absolute;
    background: $white;
  }
</style>
