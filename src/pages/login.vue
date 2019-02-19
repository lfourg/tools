<template>
  <div class="login">
    <div class="login-title">图表配置系统</div>
    <div class="login-form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="ruleForm.password"
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <i v-on:click="githubClick" class="icon iconfont icon-github"></i>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        ruleForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    components: {},
    created: function () {
      // 获取url里面的code
      var code = this.getUrlData('code') || '';
      if (code == '') {
        return;
      }
      console.log("code:", code)
      this.api.get("/github/user_info", {code: code}).then((response) => {
        console.log("response:", response);
        /*if(response.data.status == 100){
         this.ruleForm.username = response.data.data.login
         }else{

         }*/
      }, (response) => {

      });
    },
    methods: {
      submitForm(formName) {
        const self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            this.$router.push('/table1');
          } else {
            this.$router.push('/table1');
            return false;
          }
        });
      },
      // github登录点击事件
      githubClick: function () {
        window.location.href = 'https://github.com/login/oauth/authorize?client_id=263f45ba8ea1fb856276&redirect_uri=http://localhost:8085/#/login'
      },
      getUrlData: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
          return unescape(r[2]);
        return null;
      }
    }
  }
</script>

<style scoped>
  .login {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #354152;
  }

  .login-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
  }

  .login-form {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 200px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
  }

  i {
    font-size: 60px;
  }

  img {
    width: 80px;
    height: 80px;
  }
</style>
