import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
class VueState {
  logged = false;
  session = "";
}
export default new Vuex.Store({
  state: new VueState(),
  mutations: {
    login(state) {
      state.logged = true;
    },
    logout(state) {
      state.logged = false;
      state.tableList = [];
      state.session = "";
    },
    session(state, newSession) {
      state.session = newSession;
    }
  },
  actions: {},
  getters: {
    getLoginState(state) {
      return state.logged;
    },
    getSession(state) {
      return state.session;
    }
  }
});
