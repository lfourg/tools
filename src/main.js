// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import ElementUI from 'element-ui'
import Api from './assets/js/api.js'
import Common from './assets/js/common.js'

import './assets/font/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import './assets/css/reset.css'
import './assets/css/public.scss'

Vue.config.productionTip = false
Vue.prototype.api = Api;

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  /*template: '<App/>',
   components: {App},*/
  created(){

    let userStr = localStorage.getItem('currUser');
    if (userStr) {
      let user = JSON.parse(userStr);
      Common.setLoginStore(this, user,true);
    } else {
      // 获取url里面的code
      var code = Common.getUrlData('code') || '';
      if (!code) return;

      Api.get("/github/user_info", {code: code}).then((res) => {
        if (res.status) {

          let gitUser = res.result;
          console.log("gitUser:",gitUser);
          Api.post("/user/github_login", {login: gitUser.login, name: gitUser.name, email: gitUser.email}).then((res) => {
            if (res.status) {
              localStorage.setItem('currUser', JSON.stringify(res.result));
              Common.setLoginStore(this, res.result,true);
            }else{
              Common.message(this, 'error', '登录失败');
            } 
            //Common.message(this, res.status ? 'success' : 'error', res.status ? '登录成功' : '登录失败');
          });
        } else {
          Common.message(this, 'error', res.result.msg);
        }
      });
    }
  },
  render: h => h(App)
})
