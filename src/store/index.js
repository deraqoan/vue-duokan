import Vue from 'vue'
import Vuex from 'vuex'
// import action from 'action'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  weekRankId: '',
  monthRankId: '',
  totalRankId: '',
  headTitle: '', // 头部文字
  previousPosition: '首页',
  source: '', // 小说源
  backPath: {},
  searchResult: {},
  pageId: parseInt(1),
  searchword: '',
  bookInfo: {},
  chapter: ''
}

export default new Vuex.Store({
  state,
  mutations
})
