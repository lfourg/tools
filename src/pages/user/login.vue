<template>
  <div class="block-login-wrap">
    <div class="login-top">
      <span class="item" style="margin-top:0;"><i class="icon iconfont icon-icp-acitve-spline"></i></span>
      <span class="item">charts</span>
    </div>
    <transition name="slide-fade">
      <div class="login-con" v-if="flag">
        <div class="login-choose">
          <span>请选择快捷登录方式</span>
        </div>
        <div class="login-div">
          <ul class="clearfix">
            <li><a @click="githubClick"><i class="icon iconfont icon-github"></i></a></li>
            <!--<li><a title="暂不支持"><i class="icon iconfont icon-qqfuben"></i></a></li>-->
          </ul>
        </div>
      </div>
    </transition>
    <transition name="slide-fade">
      <div class="login-con" v-if="!flag">
        <el-form :model="user" label-width="80px" size="small">
          <el-form-item label="用户名">
            <el-input v-model="user.name" class="inp"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <div class="inp el-input el-input--small">
              <input type="password" v-model="user.pwd" class="el-input__inner" @keyup.enter="login"/>
            </div>
            <!--<el-input type="password" v-model="user.pwd" class="inp" @keyup.enter="login"></el-input>-->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button @click="closeLogin">关闭</el-button>
          </el-form-item>
        </el-form>
        <transition name="slide-fade-error">
          <el-alert
            :title="error.msg"
            v-if="error.show"
            type="error"
            :closable="false"
            show-icon>
          </el-alert>
        </transition>
      </div>
    </transition>
    <div class="login-model">
      <span @click="change">{{flag?'切换用户登录':'切换快捷登录'}}</span>
    </div>
  </div>
</template>

<script>
  import Common from '../../assets/js/common.js'
  export default{
    name: 'login',
    data(){
      return {
        flag: 1,
        user: {
          name: '',
          pwd: ''
        },
        error: {
          msg: '',
          show: false
        }
      }
    },
    mounted(){

    },
    methods: {
      login(){
        if (!this.user.name || !this.user.pwd) {
          this.error = {
            msg: '用户名或密码不能为空',
            show: true
          }
          this.closeAlert();
          return;
        }
        this.api.post("/user/find", this.user).then((res) => {
          console.log('user:',res);
          if (!res.result) {
            this.error = {
              msg: '用户名或密码错误',
              show: true
            }
            this.closeAlert();
          } else {
            localStorage.setItem('currUser', JSON.stringify(res.result));
            Common.setLoginStore(this,res.result,true);
          }
        });
      },
      change(){
        this.flag = !this.flag;
      },
      closeAlert(){
        let that = this;
        setTimeout(function () {
          that.error.show = false;
        }, 1500)
      },
      closeLogin(){
        this.$store.dispatch("setLoginDialogState", false);
        this.$store.dispatch("setProjects", []);
      },
      // github登录点击事件
      githubClick: function () {
        window.location.href = 'https://github.com/login/oauth/authorize?client_id=263f45ba8ea1fb856276&redirect_uri='+window.location.href
      },
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .slide-fade-enter-active {
    transition: all .8s ease;
  }

  .slide-fade-enter {
    transform: translateX(30px);
    opacity: .5;
  }

  .slide-fade-leave-to {
    opacity: 0;
  }

  .slide-fade-error-enter {
    opacity: .5;
  }

  .slide-fade-error-leave-active {
    transition: all .8s ease;
  }

  .slide-fade-error-leave-to {
    transform: translateX(30px);
    opacity: 0;
  }

  .block-login-wrap {
    height: 400px;
    .login-top {
      height: 140px;
      padding-top: 25px;
      //box-shadow: 0 8px 6px -6px $darkGrey3;
      margin: -60px -20px 0 -20px;
      background-color: $red;
      border-radius: 5px 5px 0 0;
      text-align: center;
      .item{
        display: block;
        margin:0 auto;
        color:#fff;
        font-size: 20px;
        margin-top:-20px;
        text-shadow: 2px 2px 2px rgb(61, 73, 84);
        font-weight: bold;
        i{
          font-size: 70px;
          
        }
      }
    }
    .login-con {
      position: absolute;
      width: 300px;
      padding-top: 40px;
      .inp {
        width: 85%;
      }
      .login-choose {
        position: relative;
        text-align: center;
        font-size: 14px;
        padding: 0 0 30px;
      }
      .login-div {
        ul {
          li {
            float: left;
            width: 100%;
            text-align: center;
            i {
              display: block;
              margin: 0 auto 10px;
              font-size: 60px;
              opacity: .6;
              &:hover {
                color: $red;
              }
            }
          }
        }
      }
    }
    .login-model {
      position: absolute;
      font-size: 12px;
      color: $gray;
      bottom: 5px;
      right: 15px;
      span {
        cursor: pointer;
        &:hover {
          color: $red;
        }
      }
    }
  }
</style>
