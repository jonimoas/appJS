import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuecidity from 'vuecidity'
import '../node_modules/vuecidity/dist/lib/vuecidity.min.css'

Vue.config.productionTip = false
Vue.use(Vuecidity)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
