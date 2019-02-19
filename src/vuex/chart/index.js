const state = {
  projects: [],
  types: []
}
export  default {
  state,
  mutations: {
    setProjects (state, _projects){
      state.projects = _projects;
    },
    setTypes(state, _types){
      state.types = _types;
    }
  },
  actions: {
    setProjects (context, _projects){
      context.commit('setProjects', _projects);
    },
    setTypes(state, _types){
      context.commit('setTypes', _types);
    }
  },
  getters: {
    getProjects(state){
      return state.projects;
    },
    getTypes(state){
      return state.types;
    }
  }
}
