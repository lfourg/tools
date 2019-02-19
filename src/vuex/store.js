import Vue from 'vue'
import Vuex from 'vuex'
import menu from './menu/index'
import user from './user/index'
import chart from './chart/index'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    menu, user, chart
  },
  strict: debug
})
