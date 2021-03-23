import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import modules from './modules';

// console.log(modules);

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  getters
})

export default store
