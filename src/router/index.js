import Vue from 'vue'
import Router from 'vue-router'
import PageApp from '@/pages/App'
import Index from '@/pages/index'
import Chart from '@/pages/chart'
import Detail from '@/pages/detail'
import User from '@/pages/user'
import AddUser from '@/pages/user/addUser'
import Login from '@/pages/login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PageApp',
      component: PageApp,
      children: [
        /*{
          path: '',
          name: 'index',
          component: Index,
          beforeEnter: (to, from, next) => {
            next();
          }
        },*/
        {
          path:'',
          name:'index',
          component:Chart
        },
        {
          path: 'chart/:type',
          name: 'chart',
          component: Chart
        },
        {
          path: 'user',
          name: 'user',
          component: User,
          beforeEnter: (to, from, next) => {
            /*let $store = this.a.app.$options.store;
             $store.dispatch("setCurrMenu", {flag: ''});
             if ($store.getters.getIsLogin)
             next();
             else
             next("/");*/
            next();
          }
        },
        {
          path: 'addUser',
          name: 'addUser',
          component: AddUser
        },
        {
          path: 'login',
          name: 'login',
          component: Login
        }
      ]
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: Detail
    }
  ]
})
