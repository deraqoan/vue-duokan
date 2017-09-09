<template>
	<div class="rank">
    <div class="left">
			<h2 class="title">男生</h2>
      <div class="type">
      <div class="category-type" v-for="(item, index) in ranklist.male" @click="change(item, index)" v-if="!item.collapse"  :class="{'act': index === majorSelect}">
		<span >{{item.title}}</span>
    </div>
		<span class="category-type">别人家的排行榜</span>
  </div>
		<h2 class="title">女生</h2>
    <div class="type">
      <div  class="category-type" v-for="item in ranklist.female" @click="change(item)" v-if="!item.collapse" :key="item._id">
		<span>{{item.title}}</span>
  </div>
		<span class="category-type">别人家的排行榜</span>
    </div>
  </div>
	    <section>
	    	<h1>{{$store.state.headTitle}}</h1>
				<span class="mtitle">更多筛选</span>
				<ul class="select-bar">
					<li @click="setType" :class="{'active': dex === majorSelected}">周榜</li>
					<li @click="setmonth" :class="{'active': dex === monthSelected}">月绑</li>
					<li @click="settotal" :class="{'active': dex === totalSelected}">总榜</li>
				</ul>
	    	<ul class="book-list">
	    		<Booklist v-for="book in books" :book="book" :key="book._id" class="book"></Booklist>
	    	</ul>
	    </section>
      <ul class="page">
      <li @click="goback">上一页</li>
      <li v-for="(n, index) in pagenum" class="pagetab" :class="{'active': index === nowPage}" @click="pagetab(index, n)">{{n}}</li>
      <li  @click="gohead">下一页</li>
      <li><span>去第</span><input type="number" class="put"  v-model="searchPage">
        <input type="button" value="确认" class="button" @click="goPage">
        页<span>共{{ Math.ceil(total/20)}}页</span></li>
    </ul>
	</div>
</template>
<script>
import api from '@/api/api'
import Booklist from '@/components/common/Booklist'
import { SET_BACK_POSITION, SET_PAGE_ID } from '@/store/mutationsType'
import { Indicator } from 'mint-ui'

export default {
  name: 'Rank',
  components: {
    Booklist
  },
  data () {
    return {
      ranklist: {},
      ranktype: '54d42d92321052167dfb75e3',
      maleOtherRankIsShow: false,
      femaleOtherRankIsShow: false,
      rank: {},
      total: [],
      nowPage: 0,
      pagenum: [],
      searchPage: '',
      majorSelected: 0,
      monthSelected: 1,
      totalSelected: 2,
      majorSelect: 0,
      dex: 0,
      books: [],
      types: [{
        type: '_id',
        name: '周榜'
      }, {
        type: 'monthRank',
        name: '月榜'
      }, {
        type: 'totalRank',
        name: '总榜'
      }]
    }
  },
  created () {
    api.getRankType().then(response => {
      this.ranklist = response.data
    }).catch(err => {
      console.log(err)
    })
    
    this.getRankList(this.ranktype)

    this.$store.commit(SET_PAGE_ID, parseInt(1))
    this.getPage()

  },
  methods: {
  	getRankList(ranktype){
      Indicator.open('加载中')
  		api.getRankList(ranktype).then(response => {
        this.rank = response.data.ranking
        this.books = response.data.ranking.books.slice(0, 20)
        this.total = response.data.ranking.total
        Indicator.close()
      }).catch(error => {
        Indicator.close()
        console.log(error)
      })
  	},
    setType () {
      this.dex = 0
  	  this.getRankList(this.$store.state.weekRankId)
  	},
  	setmonth () {
      this.dex = 1
  	  this.getRankList(this.$store.state.monthRankId)
  	},
  	settotal () {
      this.dex = 2
  	  this.getRankList(this.$store.state.totalRankId)
  	},
    getPage () {
      this.pagenum = []
      for (var i = 0; i < 4; i++) {
        let num = i
        this.pagenum.push(this.$store.state.pageId+i)
      };
    },
    pagetab(index, n){
      this.books = this.rank.books.slice(n * 20 - 20, n * 20)
      this.$store.commit(SET_PAGE_ID, n)
      this.getPage()
    },
    goback () {
      this.$store.commit(SET_PAGE_ID, this.$store.state.pageId-1)
      this.getPage()
      this.pagetab(1, this.$store.state.pageId)

    },
    gohead () {
      this.$store.commit(SET_PAGE_ID, this.$store.state.pageId+1)
      this.getPage()
      this.pagetab(1, this.$store.state.pageId)

    },
    goPage () {
      this.$store.commit(SET_PAGE_ID, parseInt(this.searchPage))
      this.getPage()
      this.pagetab(1, this.$store.state.pageId)

    },
  	change(item, index){
      this.majorSelect = index
  		this.getRankList(item._id)
  		this.$store.commit('SET_RANK', item)
  	},
    changeHeadText () {
      this.$store.commit('setHeadText', '排行榜')
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.changeHeadText()
    })
  }
}
</script>

<style scoped>
.rank{
  background: #fbfaf8;
}
ul {
	padding: 0 15px;
}
.title{
  padding-left: 28px;
  margin-bottom: 5px;
  font-size: 24px;
  color: #613f23;
  line-height: 48px;
  font-weight: 400;
}
ul {
  padding: 0 15px;
}

li {
  display: inline-block;
  height: 30px;
  margin-top:10px;
  color: #613f23;
  line-height: 30px;
  padding: 0 10px;
  font-size: 14px;
  cursor: pointer;
}
section{
  float: right;
  width: 78%;
  padding: 0 15px;
}
h1{
  width: 100%;
  margin:0;
  height: 60px;
  line-height: 60px;
  padding-left: 15px;
  color: #613f23;
  font-size: 22px;
  font-weight: 700;
}
.mtitle{
  width: 100%;
  height: 20px;
  line-height: 20px;
  padding: 0 15px;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 700;
  border-left: 5px solid #fa7a20;
}
.category {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 0.1rem;
  margin-top: 10px;
  line-height: 1.3rem;
}
.left{
  float: left;
  width: 21%;
  height:100%;
  margin:0;
  color: #613f23;
  border-right:1px solid #ccc;
}
.category-type {
  display: block;
  height: 60px;
  line-height: 60px;
  padding-left: 28px;
  font-size: 16px;
  cursor: pointer;
}
.act{
  border-right: 4px solid #fa7a20;
  background: #f4f2ef;
  color: #fa7a20;
}
.pagetab{
  height: 30px;
  margin-right: 5px;
  padding: 0 10px;
  line-height: 30px;
  text-align: center;
  margin-bottom: 20px;
}
.active {
  color: #fff;
  background:  #fa7a20;
  border-radius: 5px;
}
.book{
  height:150px;
  width: 45%;
}
.booklist{
  overflow: hidden;
  width: 100%;
}
.page{
  float: right;
  width: 78%;
  display: inline-block;
  text-align: center;
}
.button{
  background:  #fa7a20;
  text-decoration: none;
  border:none;
  height: 25px;
  line-height: 25px;
  border-radius: 5px;
}
.put{
  width: 40px;
  height: 20px;
}
</style>
