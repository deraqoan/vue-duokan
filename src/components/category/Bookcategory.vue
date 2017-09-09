<template>
	<div class="bookcate">
		<div class="type">
      <div class="category-type"  :class="{'act': index === majorSelect}"  v-for="(item, key, index) in category" :key="index" @click="change(item, key, index)" v-if="categoryType[key]">
		<span>{{categoryType[key]}}</span>
       </div>
	    </div>
		<section v-for="(item ,key, index) in category" :key="index">
			<div v-if="index==nowindex">
			<h1>{{categoryType[key]}}</h1>
			<span class="mtitle">作品类型</span>
			<ul>
				<li  :class="{'active': index === catSelected}" v-for="(cat, index) in item" :key="index" @click="getCategory(key, cat.name, index)">
					<h4 class="category">{{cat.name}}</h4>
				</li>
			</ul>
			<ul class="select-bar" v-if="mins.length">
				<li data-type="hot">全部</li>
				<li :class="{'active': index === minorSelected}" v-for="(minor, index) in mins" :key="index" @click="setMinor(minor, index)">{{minor}}</li>
			</ul>
			<span class="mtitle"  v-if="mins.length">更多筛选</span>
			<ul class="select-bar"  v-if="mins.length">
				<li v-for="(item, index) in types" :class="{'active': index === majorSelected}" :key="index"  @click="setType(item.type,index)">{{item.name}}</li>
			</ul>
			<ul class="book-list">
				<Booklist v-for="book in books" :book="book" :key="book._id" class="book"></Booklist>
			</ul>
		</div>
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
  name: 'Booklcat',
  components: {
    Booklist
  },
  data () {
    return {
      category: null,
      categoryType: {
        male: '男生',
        female: '女生',
        picture: '漫画',
        press: '出版'
      },
      minorSelected: 0,
      searchPage: '',
      majorSelected: 0,
      majorSelect: 0,
      total: [],
      nowPage: 0,
      pagenum: [],
      type: 'hot',
      num: [1, 2, 3, 4],
      gender: '',
      major: '',
      minor: '',
      nowindex: 0,
      mins: [],
      books: [],
      types: [{
        type: 'hot',
        name: '热门'
      }, {
        type: 'new',
        name: '新书'
      }, {
        type: 'reputation',
        name: '好评'
      }, {
        type: 'over',
        name: '完结'
      }, {
        type: 'monthly',
        name: '包月'
      }]
    }
  },
  created () {
    api.getCategory().then(response => {
      this.category = response.data
      this.loading = false
    }).catch(err => {
      console.log(err)
    })

    this.getCategory('male', '玄幻', 0)

    this.getNovelListByCat('male', 'hot', '玄幻')
    this.$store.commit(SET_PAGE_ID, parseInt(1))
    this.getPage()
  },
  methods: {
  	getNovelListByCat (gender, type, major, minor) {
  	  Indicator.open('加载中')
  	  api.getNovelListByCat(gender, type, major, minor).then(response => {
  	    Indicator.close()
  	    this.books = response.data.books.slice(0, 20)
        this.total = response.data.total
  	  }).catch(err => {
  	    console.log(err)
  	  })
  	},
    getPage () {
      this.pagenum = []
      for (var i = 0; i < 4; i++) {
        let num = i
        this.pagenum.push(this.$store.state.pageId+i)
      };
    },
  	setType (type, index) {
  	  this.majorSelected = index
  	  this.type = type
  	  this.getNovelListByCat(this.gender, this.type, this.major, this.minor)
  	},
  	setMinor (minor, index) {
  	  this.minorSelected = index
  	  this.minor = minor
  	  this.getNovelListByCat(this.gender, this.type, this.major, this.minor)
  	},
  	change(item, key, index){
  		this.nowindex = index
      this.majorSelect = index
  		this.getCategory(key, item[0].name, 0)
  		this.gender = key
  		this.major = item[0].name
  		this.getNovelListByCat(key, this.type, item[0].name)
  	},
    pagetab(index, n){
      Indicator.open('加载中')
      api.getNovelListByCat(this.gender, this.type, this.major, this.minor, (n) * 20).then(response => {
        Indicator.close()
        this.$store.commit(SET_PAGE_ID, n)
        this.books = response.data.books.slice(0, 20)
        this.getPage()
      }).catch(err => {
        console.log(err)
      })
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
  	getCategory(key, name, index){
  		this.gender = key
  		this.major = name
      this.catSelected = index
  		api.getCategoryDetail().then(response => {
  		  response.data[key].forEach((type) => {
  		    if (type.major === name) {
  		      this.mins = type.mins
  		      this.major = type.major
  		    }
  		    
  		  })
  		}).catch(err => {
  		  console.log(err)
  		})
  		this.getNovelListByCat(key, this.type, name)
  	}
  }
}
</script>
<style scoped>
ul {
	padding: 0 15px;
}

li {
	display: inline-block;
	height: 30px;
  margin-top:10px;
	line-height: 30px;
	padding: 0 10px;
	font-size: 14px;
	cursor: pointer;
  color: #613f23;
}
section{
	float: right;
  width: 78%;
  background: #fbfaf8;
  padding: 0 15px;
}
h1{
	width: 100%;
	margin:0;
	height: 60px;
	line-height: 60px;
	padding-left: 15px;
	color: #fa7a20;
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
.type{
	float: left;
	width: 21%;
	height:100%;
  background: #fbfaf8;
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
  background: #fbfaf8;
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
