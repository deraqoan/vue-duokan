<template>
	<div class="home">
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
				<img slot="icon" src="../assets/logo.png">
			</div>
			<div class="search">
			    <div class="search-head">
			    	<input type="text" class="search-input" placeholder="输入书名或者作者名" @keyup.enter="fuzzySearch" v-model="searchWord">
			    	<span class="search-icon" @click="fuzzySearch">
			    		<img src="../assets/search.png">
			    	</span>
			    </div>
		    </div>
		</div>
		<mt-navbar v-model="selected" :value="selected" class="nav row">
			<mt-tab-item id="首页">
				<span>首页</span>
			</mt-tab-item>
			<mt-tab-item id="精选">
				<span>精选</span>
			</mt-tab-item>
			<mt-tab-item id="分类">
				<span>分类</span>
			</mt-tab-item>
			<mt-tab-item id="排行榜">
				<span>排行榜</span>
			</mt-tab-item>
			<mt-tab-item id="书单">
				<a href="http://www.duokan.com/review/"><span>书评</span></a>
			</mt-tab-item>
			<mt-tab-item id="客户端">
			    <a href="http://www.duokan.com/product"><span>客户端</span></a>
			</mt-tab-item>
		</mt-navbar>
		<mt-tab-container v-model="selected" :swipeable="false" :value="selected" class="row">
			<mt-tab-container-item id="首页">
				<Bookshelf class="tab-container" @addBook="changeSelected"></Bookshelf>
			</mt-tab-container-item>
			<mt-tab-container-item id="精选">
				<keep-alive include="Bookshelf">
				    <jingxuan  class="tab-container"></jingxuan>
				</keep-alive>
			</mt-tab-container-item>
			<mt-tab-container-item id="分类">
				<keep-alive include="Rank">
				    <Bookcategory class="tab-container"></Bookcategory>
				</keep-alive>
			</mt-tab-container-item>
			<mt-tab-container-item id="排行榜">
			    <Ranklist class="tab-container"></Ranklist>
			</mt-tab-container-item>
			<mt-tab-container-item id="搜索">
			     <Search></Search>
			</mt-tab-container-item>
		</mt-tab-container>
		<footer class="foot row">
			<ol class="breadcrumb head">
			    <li>手机版</li>
			    <li>关于我们</li>
			    <li>联系我们</li>
			    <li>商务合作</li>
			    <li>隐私政策</li>
			</ol>
			<p>
				京ICP备10047083号&nbsp电复证字第01D010号&nbsp京公网安备11010802022293号
			</p>
		</footer>
	</div>
</div>
</template>

<script>
import Bookshelf from './bookshelf/Bookshelf'
import Bookcategory from './category/Bookcategory'
import Ranklist from './ranklist/Rank'
import Search from './search/Search'
import jingxuan from './jingxuan/jingxuan'
import { Indicator } from 'mint-ui'
import api from '@/api/api'
import {
  SET_BACK_POSITION,
  SET_SEARCH_WORD,
  SET_SEARCH_RESULT
} from '@/store/mutationsType'

export default {
  name: 'home',
  components: {
    Bookshelf,
    Bookcategory,
    Ranklist,
    Search,
    jingxuan
  },
  data () {
    return {
      searchWord: '',
      selected: ''
    }
  },
  methods: {
    changeSelected (data) {
      this.selected = data
    },
    fuzzySearch () {
    	Indicator.open()
    	this.selected = '搜索'
    	this.$store.commit(SET_SEARCH_WORD, this.searchWord)
    	api.fuzzySearch(this.searchWord).then(response => {
    	  this.$store.commit(SET_SEARCH_RESULT, response.data.books)
    	   Indicator.close()
    	}).catch(err => {
    	  console.log(err)
    	})
    }
  },
  mounted () {
    this.selected = this.$store.state.previousPosition
  }
}
</script>

<style scoped>
.home{
	width:100%;
	background: #fbfaf8;
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
    cursor: pointer;
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
	min-height: 100vh;
}
.breadcrumb{
	background: #fbfaf8;
	color: #8c8c8c;
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
