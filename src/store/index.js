import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    themeList:['chalk','black','purple_passion','essos','wonderland','vintage','customed','walden','macarons'],
    theme:'chalk'
  },
  mutations: {
    changeTheme(state){
      console.log('state',state)
      const themeIndex = state.themeList.findIndex((item)=>{return item === state.theme});
      console.log('themeIndex',themeIndex)
      if(themeIndex=== state.themeList.length-1){
        state.theme = state.themeList[0]
      }else{
        state.theme = state.themeList[themeIndex+1]
      }

    }
  },
  actions: {
  },
  modules: {
  }
})
