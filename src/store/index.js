import Vuex from "vuex"
import Vue from 'vue'
import NavTabs from './navTabs'
import Badge from './badge'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        navTabs: NavTabs,
        badge: Badge
    }
})