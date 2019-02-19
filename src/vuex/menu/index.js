//{name: '首页', flag: 'index', url: '/', icon: 'icon-weibiaoti1'},
let menus = {
  base: [
    {name: '类型导航', flag: 'charttype', url: '/chart/type', icon: 'icon-zhuzhuangtu1'},
  ],
  person: [
    {name: '项目导航', flag: 'chartpro', url: '/chart/pro', icon: 'icon-weibiaoti2010103-copy'}
  ]
}
const state = {
  menus: menus.base,
  currMenu: menus.base[0]
}
export  default {
  state,
  mutations: {
    setCurrMenu (state, _currMenu){
      state.currMenu = _currMenu;
    },
    setMenus(state, _menus){
      state.menus = _menus;
    }
  },
  actions: {
    setCurrMenu (context, _currMenu){
      context.commit('setCurrMenu', _currMenu);
    },
    setMenus(context, _isLogin){
      context.commit("setMenus", _isLogin ? [...menus.base, ...menus.person] : menus.base);
    }
  },
  getters: {
    getCurrMenu (state){
      return state.currMenu;
    },
    getMenus(state){
      return state.menus;
    }
  }
}
