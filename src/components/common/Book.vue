<template>
	<div class="book">
	<div class="container">
			<ol class="breadcrumb head">
			    <li>小米网</li>
			    <li>MIUI</li>
			    <li>米聊</li>
			    <li>游戏</li>
			    <li class="active">多看阅读</li>
			    <li>云服务</li>
			    <li>小米网移动版</li>
			    <li class="pullright">
			    	<ol class="breadcrumb">
			            <li>登录/注册</li>
			            <li>购物车</li>
			            <li class="dropdown">
			                  <span class="dropdown-toggle" data-toggle="dropdown" href="#">
			                  +关注<span class="caret"></span>
			                   </span>
			                  <ul class="dropdown-menu">
			                    <li>官方微信</li>
			                    <li>官方微博</li>
			                  </ul>
			                </li>
			            <li class="dropdown">
			                  <span class="dropdown-toggle" data-toggle="dropdown" href="#">
			                  快速导航<span class="caret"></span>
			                   </span>
			                  <ul class="dropdown-menu">
			                    <li>兑换码换书</li>
			                    <li>最新上架</li>
			                  </ul>
			                </li>
			        </ol>
			     </li>
			</ol>
			<div class="wrap row">
				<div class="logo">
					<img slot="icon" src="../../assets/logo.png">
				</div>
				<div class="search">
				    <div class="search-head">
				    	<input type="text" class="search-input" placeholder="输入书名或者作者名" @keyup.enter="gotosearch" v-model="searchWord">
				    	<span class="search-icon" @click="gotosearch">
				    		<img src="../../assets/search.png">
				    	</span>
				    </div>
			    </div>
			</div>
			<mt-navbar v-model="selected" :value="selected" class="nav row">
				<mt-tab-item id="首页">
					<span  @click="gotoindex">首页</span>
				</mt-tab-item>
				<mt-tab-item id="精选">
					<span @click="gotojingxuan">精选</span>
				</mt-tab-item>
				<mt-tab-item id="分类">
					<span @click="gotocate">分类</span>
				</mt-tab-item>
				<mt-tab-item id="排行榜">
					<span @click="gotorank">排行榜</span>
				</mt-tab-item>
				<mt-tab-item id="书单">
					<a href="http://www.duokan.com/review/"><span>书评</span></a>
				</mt-tab-item>
				<mt-tab-item id="客户端">
				    <a href="http://www.duokan.com/product"><span>客户端</span></a>
				</mt-tab-item>
			</mt-navbar>
		<section v-if="!$store.state.previousPosition" class="row">
			<div class="book-info">
				<img v-if="book" :src="imgUrl" onerror="javascript:this.src='https://github.com/zimplexing/vue-nReader/blob/master/screenshot/errBook.png?raw=true'">
				<div class="book-info-detail">
					<h2 class="book-title" v-if="book">{{book.title}}</h2>
					<p>作者：{{book.author}}</p>
					<p>人气：{{wordCount}}万</p>
					<p>更新：{{book.updated | ago}}</p>
					<p>日更新字数:{{book.serializeWordCount}}</p>
					<p>{{book.cat}}</p>
					<div class="book-operation">
						<mt-button type="primary" class="btn" @click="readBook">阅读</mt-button>
					</div>
				</div>
			</div>
			<div class="book-tag" v-if="book">
				<h3>图书标签</h3>
				<span v-for="(tag, index) in book.tags" :key="index" class="tag">{{tag}}</span>
			</div>
			<div class="book-status">
				<div class="list-item">
					<span class="item">追书人气</span>
					<span v-if="book" class="value">{{book.latelyFollower}}</span>
				</div>
				<div class="list-item">
					<span class="item">读者留存率</span>
					<span v-if="book" class="value">{{book.retentionRatio}}%</span>
				</div>
			</div>
			<ul class="navl">
				<li v-for="(item, index) in tab"  @click="tabitem(item)" :key="item" :class="{'act': item === selected}"><span>{{item}}</span></li>
			</ul>
			<mt-tab-container v-model="selected" :swipeable="false" :value="selected">
				<mt-tab-container-item id="简介">
				  <p class="book-intro" v-if="book">简介：<br>&nbsp&nbsp&nbsp&nbsp{{book.longIntro}}</p>
				</mt-tab-container-item>
				<mt-tab-container-item id="目录">
				  <ul v-if="loadedChapters" class="chapter">
				  	<h1>目录：</h1>&nbsp&nbsp&nbsp&nbsp
				  	<v-touch tag="li" v-for="(chapter, index) in loadedChapters" :key="index" @tap="jumpChapter(index)">{{chapter.title}}</v-touch>
				  </ul>
				</mt-tab-container-item>
				<mt-tab-container-item id="评价">
				 <ul v-if="review" class="reviews">
				   <span class="mtitle">精彩评论：</span><br>&nbsp&nbsp&nbsp&nbsp
                   <li v-for="(item, index) in review" class="review" v-if="review">
                   	<img v-if="book" :src="avattar[index]" width="40px" height="40px" class="avatar">
                   	<div class="author">
                   	<span class="nickname">{{item.author.nickname}}</span>
                   	<span class="update">{{item.updated.slice(0,10)}}</span>
                   	<br>
                   	<span class="content">{{item.content}}</span>
                    </div>
                   </li>
                   <li v-if="!review">暂无评价</li>
                   </ul>
				</mt-tab-container-item>
			</mt-tab-container>
			
			
		</section>
	</div>
	</div>
</template>

<script>
import api from '@/api/api'
import moment from 'moment'
import axios from 'axios'
import Home from '@/components/Home'
import { Indicator, MessageBox, Toast } from 'mint-ui'
import util from '@/utils/util'
import { SET_CURRENT_SOURCE, SET_READ_BOOK, SET_CHAPTER, SET_BACK_POSITION,SET_SEARCH_WORD, SET_SEARCH_RESULT } from '@/store/mutationsType'

moment.locale('zh-cn')
export default {
  name: 'Book',
  data () {
    return {
      book: [],
      review: {},
      selected: '简介',
      searchWord: '',
      bookChaptersContent: '',
      loadedChapters: [],
      sourseId: null,
      avattar: [],
      tab:['简介', '目录', '评价']
    }
  },
  components: {
    Home
  },
  filters: {
    ago (time) {
      return moment(time).fromNow()
    }
  },
  created () {
    Indicator.open()
    api.getBook(this.$route.params.bookId).then(response => {
      this.book = response.data
      Indicator.close()
    }, err => {
      console.log(err)
    })
   
    
      api.getMixSource(this.$route.params.bookId).then(response => {
        this.$store.commit(SET_CURRENT_SOURCE, response.data[0]._id)
        api.getChapters(this.$store.state.source).then(response => {
          this.loadedChapters = response.data.chapters
          Indicator.close()
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })

    axios.get('http://www.zhuishushenqi.com/book/review/' + this.$route.params.bookId + '?page=1').then(response => {
      	this.review = response.data.reviews
      	for (var i = 0; i < response.data.reviews.length; i++) {
      		this.avattar.push(util.staticPath + response.data.reviews[i].author.avatar)
      	};
      }).catch(function(err){
        console.log(err);
      })
  },
  beforeRouteEnter (to, form, next) {
    next(vm => {
      vm.backStep = form.path.indexOf('readbook') !== -1 ? -3 : -1
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.path.indexOf('changeSource') !== -1 || to.path.indexOf('readbook') !== -1) {
      next()
    } else {
      this.$store.commit(SET_CURRENT_SOURCE, '')
      this.$store.commit(SET_BACK_POSITION, '首页')
      next()
    }
  },
  computed: {
    wordCount () {
      return parseInt(this.book.wordCount / 10000, 10)
    },
    imgUrl () {
      return util.staticPath + this.book.cover
    }
  },
  methods: {
    readBook () {
      this.$store.commit(SET_READ_BOOK, this.book)
      this.$router.push('/readbook/' + this.$route.params.bookId)
    },
    jumpChapter (index) {
      this.readBook ()
      this.$store.commit(SET_CHAPTER, index-1)
    },
    tabitem (item) {
      this.selected = item
    },
    gotoindex () {
    	this.$router.push('/')
    	this.$store.commit(SET_BACK_POSITION, '首页')
    },
    gotojingxuan () {
    	this.$router.push('/')
    	this.$store.commit(SET_BACK_POSITION, '精选')
    },
    gotocate () {
    	this.$router.push('/')
    	this.$store.commit(SET_BACK_POSITION, '分类')
    },
    gotorank () {
    	this.$router.push('/')
    	this.$store.commit(SET_BACK_POSITION, '排行榜')
    },
    gotosearch () {
    	Indicator.open()
    	this.$store.commit(SET_SEARCH_WORD, this.searchWord)
    	api.fuzzySearch(this.searchWord).then(response => {
    	  this.$store.commit(SET_SEARCH_RESULT, response.data.books)
    	  console.log(this.$store.state.searchResult)
    	   Indicator.close()
    	}).catch(err => {
    	  console.log(err)
    	})
    	this.$router.push('/')
    	this.$store.commit(SET_BACK_POSITION, '搜索')
    	this.selected = '搜索'

    }
  }
}
</script>

<style scoped>
.book{
	background: #fbfaf8;
	width: 100%;
	color: #613f23;
}
section {
	padding: 20px 50px;
	background: #fbfaf8;
}
.book-info {
	width: 100%;
	height: 240px;
}

.book-info img {
	width: 180px;
	height: 240px;
}
.book-info .book-info-detail {
	margin-left: 210px;
    height: 100%;
    position: relative;
    margin-top:-240px;
}
h3{
	line-height: 25px;
	font-size: 20px;
}
.book-title{
	line-height: 1.5rem;
    font-size: 20px;
    color: #000;
}
.book-info p {
	line-height: 20px;
    font-size: 14px;
    vertical-align: top;
}
.book-status {
	margin-bottom: 10px;
	position: relative;
	margin-top:-80px;
	float: right;
	width: 220px;
	height: 50px;
	line-height: 38px;
}
.list-item {
	display: inline-block;
    vertical-align: middle;
    width: 33%;
}
.act{
	color: #000;
	font-size: 16px;
}
.item {
	display: block;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-style: normal;
}
.value{
	display: block;
	height: 30px;
	line-height: 30px;
	font-size: 18px;
	font-weight: 700;
	font-style: normal;
	color: #fa7a20;
}
.book-operation .btn {
	height: 30px;
	padding: 0 15px;
	font-size: 14px;
	line-height: 30px;
	border-radius: 3px;
	float: left;
	margin-right: 5px;
	color: #fff;
    border: 1px solid #3d76de;
    background: #4d87de;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.1), 0 2px 2px rgba(77,153,22,.1);
}
.navl{
	position: relative;
    height: 38px;
    margin-top: 20px;
    line-height: 38px;
    padding: 0;
    border-bottom: 1px solid #dbd4cd;
}
.navl li{
	float: left;
	text-align: center;
	font-size: 14px;
	cursor: pointer;
	width: 5em;
}
.navl li span:after{
    content: '';
    display: block;
    height: 20px;
    width: 1px;
    margin-left: 5em;
    margin-top: -30px;
    background: #dbd4cd;
}
.mtitle{
	width: 100%;
	height: 20px;
	line-height: 20px;
	padding: 0 15px;
	margin-bottom: 10px;
	font-size: 16px;
	font-weight: 700;
	border-left: 5px solid #fa7a20;
}
.book-tag {
	float: right;
	width: 220px;
	margin-top:-240px;
}
.tag {
	float: left;
	margin: 0 8px 6px 0;
	height: 24px;
	line-height: 24px;
	white-space: nowrap;
	background: #ebe7e3;
	padding: 0 10px;
	border-radius: 3px;
}
.book-intro {
	margin-top: 10px;
	font-size: 16px;
	padding: 10px 20px;
}
.chapter{
	padding: 10px 20px;
	margin-top: 0;
}
h1{
    margin-left: 45%;
}
.chapter li {
    position: relative;
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    border-bottom: 1px dashed #ccc;
}
.review{
    display: flex;
    margin-bottom: 10px;
    border-top: 1px dashed #ccc;
}
.reviews{
    margin-top: 0;
    padding: 10px 20px;
}
.author{
   margin-left: 15px;
}
.nickname, .update{
	height: 20px;
    line-height: 20px;
    color: #666;
    font-size: 14px;
}
 .update{
 	right: 20px;
 	position: absolute;
 }
.content{
	line-height: 18px;
	margin: 5px 0;
	font-size: 16px;
	text-overflow: ellipsis;
}
.head{
	margin:0;
    border-bottom: 1px solid #eae6e2;
}
.pullright{
	float: right;
	margin-top:-25px;
}
.active{
	color:#000;
}
.wrap{
	height: 88px;
	padding: 20px 0;
	background: #fbfaf8;
}
.search{
    width: 300px;
    float:right;
    margin-right:10px;
    margin-top:-44px;
    z-index: 100;
}
.search-head {
	height: 38px;
	width: 300px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	padding: 0 5px;
	background: #fff;
	border: 2px solid #fa7a20;
	border-radius: 5px;
}
.search-input {
	width: 100%;
	font-size: 16px;
	line-height: 16px;
	padding-left: 10px;
	border: none;
}

.search-input:focus,
.cancel:focus {
	outline: none;
}
.search-icon img {
	line-height: 3.5rem;
	width: 20px;
	top: 0.75rem;
}
input, a{
	outline: none;
	box-shadow:none;
	text-decoration: none;
}
.nav{
	background:#fa7a20;
	border-radius: 5px;
	color: #fff;
}
.mint-navbar .mint-tab-item.is-selected {
    border-bottom: none;
    height:47px;
    background: #f16300;
    margin-bottom: 0;
}
.mint-navbar .mint-tab-item {
    display: block;
    border-radius: 5px;
}
.mint-tab-item span{
	font-size: 16px;
	color: #fff;
	font-weight: 500;
}
.tab-container {
	box-sizing: border-box;
	padding-top: 2rem;
	padding-bottom: 55px;
}
.breadcrumb{
	color: #8c8c8c;
	background: #fbfaf8;
}
.breadcrumb > li + li:before {
    color: #CCCCCC;
    content: "| ";
    padding: 0 5px;
}
.foot{
	height: 130px;
	text-align: center;
	padding-top: 50px;
	padding-bottom: 30px;
}
.foot li, .foot p{
	color: #613f23;
}
</style>
