const state = {
  isLogin: false,
  showLoginDialog: false,
  user: null
}
export  default {
  state,
  mutations: {
    setLoginDialogState (state, _flag){
      state.showLoginDialog = _flag;
    },
    setIsLogin(state, _login){
      state.isLogin = _login;
    },
    setUser(state, _user){
      state.user = _user;
    }
  },
  actions: {
    setLoginDialogState (context, _flag){
      context.commit('setLoginDialogState', _flag);
    },
    setIsLogin(context, _login){
      context.commit('setIsLogin', _login);
    },
    setUser(context, _user){
      context.commit('setUser', _user);
      context.commit('setIsLogin', _user ? true : false);
    }
  },
  getters: {
    getIsShowLoginDialog(state){
      return state.showLoginDialog;
    },
    getIsLogin (state){
      return state.isLogin;
    },
    getUser(state){
      if (state.user)
        delete state.user.pwd;
      return state.user;
    },
    getTestNums(state){
      return state.testNums;
    }
  }
}
