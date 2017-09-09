import {
  SET_RANK,
  SET_BACK_POSITION,
  SET_CURRENT_SOURCE,
  SET_SEC_PATH,
  SET_THIRD_PATH,
  SET_HEAD_TITLE,
  SET_PAGE_ID,
  SET_SEARCH_WORD,
  SET_READ_BOOK,
  SET_SEARCH_RESULT,
  SET_CHAPTER
} from './mutationsType'

export default {
  [SET_RANK] (state, rankDetail) {
    state.weekRankId = rankDetail._id
    state.monthRankId = rankDetail.monthRank
    state.totalRankId = rankDetail.totalRank
    state.headTitle = rankDetail.shortTitle
  },
  [SET_BACK_POSITION] (state, position) {
    state.previousPosition = position
  },
  [SET_CHAPTER] (state, chapterID) {
    state.chapter = chapterID
  },
  [SET_PAGE_ID] (state, page) {
      state.pageId = page
  },
  [SET_SEARCH_RESULT] (state, RESULT) {
      state.searchResult = RESULT
  },
  [SET_CURRENT_SOURCE] (state, source) {
    state.source = source
  },
  [SET_SEARCH_WORD] (state, word) {
    state.searchword = word
  },
  [SET_SEC_PATH] (state, prePath) {
    state.backPath.secPath = prePath
  },
  [SET_THIRD_PATH] (state, prePath) {
    state.backPath.thirdPath = prePath
  },
  [SET_HEAD_TITLE] (state, text) {
    state.headTitle = text
  },
  [SET_READ_BOOK] (state, book) {
    state.bookInfo = book
  }
}
