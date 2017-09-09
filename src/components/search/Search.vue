<template>
	<div class="search">
		<ul class="search-result">
			<h2 class="title">共{{$store.state.searchResult.length}}条<span class="active">{{$store.state.searchword}}</span>相关的搜索结果</h2>
			<Booklist v-for="book in $store.state.searchResult" :book="book" :key="book._id">
			</Booklist>
		</ul>
		<ul class="search-word" v-if="searchHotWords">
			<h4 class="ctitle">大家都在搜</h4>
			<v-touch tag="li" class="search-hot-word" v-for="(searchHotWord, index) in searchHotWords" :key="index" @tap="fuzzySearch(searchHotWord.word)">
				{{searchHotWord.word}}
			</v-touch>
		</ul>
	</div>
</template>

<script>
import api from '@/api/api'
import Booklist from '@/components/common/Booklist'
import util from '@/utils/util'
import { Indicator } from 'mint-ui'
import { SET_BACK_POSITION, SET_SEARCH_WORD, SET_SEARCH_RESULT } from '@/store/mutationsType'
import Store from '@/store/index.js';
 
export default {
  name: 'Search',
  components: {
    Booklist
  },
  data () {
    return {
      searchHotWords: null
    }
  },
  computed: {
    back () {
      return this.$store.state.backPath.secPath
    }
  },
  created () {
    this.searchHistory = util.getLocalStroageData('searchHistory') ? util.getLocalStroageData('searchHistory') : []
    api.getHotWords().then(response => {
      this.searchHotWords = response.data.searchHotWords
      this.searchHotWords.length = 10
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    fuzzySearch (word) {
    	Indicator.open()
    	this.selected = '搜索'
    	this.$store.commit(SET_SEARCH_WORD, word)
    	api.fuzzySearch(word).then(response => {
    	  this.$store.commit(SET_SEARCH_RESULT, response.data.books)
    	   Indicator.close()
    	}).catch(err => {
    	  console.log(err)
    	})
    }
  }
}
</script>

<style scoped>
.search{
	width: 100%;
	margin: 0px 5%;
	background: #fbfaf8;
}
.title{
	height: 40px;
    line-height: 40px;
    font-size: 14px;
    padding-left: 20px;
    margin-bottom: 16px;
    border-bottom: 1px solid #ebe7e2;
}
.active{
	color:#fa7a20;
}
.search-result {
	float: left;
	margin-top: 30px;
	width: 60%;
}
.ctitle{
	line-height: 40px;
}
.search-word{
	float: right;
	width: 30%;
	margin-top: 30px;
}
.search-hot-word{
	font-size: 16px;
	color: #613f23;
	float: left;
	margin-right: 40px;
	margin-bottom: 20px;
}
</style>
