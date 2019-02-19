<template>
  <div class="container">
    <div class="title clearfix">
      <h2><i class="icon iconfont icon-mima1"></i>修改密码</h2>
    </div>
    <div class="baseinfo">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="用户名">
          <el-input disabled v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="原始密码" prop="oldPwd">
          <el-input type="password" v-model="ruleForm.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwd">
          <el-input type="password" v-model="ruleForm.pwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input type="password" v-model="ruleForm.checkPwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="change">修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default{
    name: 'userInfo',
    data(){
      var validateOldPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原始密码'));
        } else {
          this.api.post("/user/find", {_id: this.user._id, pwd: value}).then((res) => {
            if (!res.result) callback(new Error('原始密码错误，请重新输入'));
            else callback();
          });
        }
      };
      var validatePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value.length < 6) {
          callback(new Error('请设置不少于6为的密码长度'));
        } else {
          callback();
        }
      };
      var validatePwd2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          oldPwd: '',
          pwd: '',
          checkPwd: ''
        },
        rules: {
          oldPwd: [
            {validator: validateOldPwd, trigger: 'blur'}
          ],
          pwd: [
            {validator: validatePwd, trigger: 'blur'}
          ],
          checkPwd: [
            {validator: validatePwd2, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'getUser',
      })
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){

      },
      change(){

        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            let _user = {_id: this.user._id, pwd: this.ruleForm.pwd};
            this.api.post("/user/update", _user).then((res) => {
              this.$message({
                showClose: true,
                message: res.status ? '密码修改成功' : '修改失败,请重新操作',
                type: res.status ? "success" : "error"
              });
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      reset(){

      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  .container {
    margin: 0 30px;
    .title {
      margin: 15px 0;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid $gray2;
      box-shadow: 0 4px 6px -6px $darkGrey3;
      h2 {
        font-size: 18px;
        i {
          font-size: 20px;
          margin-right: 5px;
          color: $red;
        }
      }
    }
    .baseinfo {
    }
  }
</style>
