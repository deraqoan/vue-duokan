<template>
	<div class="bookcate">
		<div class="type">
      <div  class="category-type" :class="{'act': index === majorSelected}" v-for="(item, index) in categoryType" :key="index" @click="change(item, index)">
		   <span>{{item.name}}</span>
        </div>
	    </div>
		<section>
      <h2>{{categoryType[majorSelected].name}}</h2>
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
  name: 'Booklcat',
  components: {
    Booklist
  },
  data () {
    return {
      category: null,
      majorSelected: 0,
      searchPage: '',
      total: [],
      nowPage: 0,
      pagenum: [],
      categoryType: [
        {
        type: 'hot',
        gender: 'female',
        major: '古代言情',
        minor: '宫闱宅斗',
        name: '本周热门'
         },
        {
        type: 'reputation',
        gender: 'press',
        major: '人文社科',
        minor: '',
        name: '出版精选'
         },
         {
         type: 'reputation',
         gender: 'male',
         major: '玄幻',
         minor: '',
         name: '男生精选'
          },
        {
         type: 'reputation',
         gender: 'female',
         major: '古代言情',
         minor: '',
         name: '女生精选'
          },
          {
         type: 'new',
         gender: 'male',
         major: '玄幻',
         minor: '',
         name: '男频新书'
          },
          {
         type: 'new',
         gender: 'female',
         major: '古代言情',
         minor: '',
         name: '女频新书'
          },
        {
         type: 'over',
         gender: 'male',
         major: '玄幻',
         minor: '',
         name: '男频完本'
          },
        {
         type: 'over',
         gender: 'female',
         major: '古代言情',
         minor: '',
         name: '女频完本'
          }
      ],
      books: []
    }
  },
  created () {
    api.getCategory().then(response => {
      this.category = response.data
      this.loading = false
    }).catch(err => {
      console.log(err)
    })

    this.$store.commit(SET_PAGE_ID, parseInt(1))
    this.getPage()
    this.getNovelListByCat('female', 'hot', '古代言情', '宫闱宅斗')
  },
  methods: {
  	getNovelListByCat (gender, type, major, minor) {
  	  Indicator.open('加载中')
  	  api.getNovelListByCat(gender, type, major, minor).then(response => {
  	    Indicator.close()
  	    this.books = response.data.books
        this.total = response.data.total
  	  }).catch(err => {
  	    console.log(err)
  	  })
  	},
  	change(item, index){
      this.majorSelected = index
  		this.getNovelListByCat(item.gender, item.type, item.major, item.minor)
  	},
    pagetab(index, n){
      Indicator.open('加载中')
      let item = this.categoryType[this.majorSelected]
      api.getNovelListByCat(item.gender, item.type, item.major, item.minor, (n) * 20).then(response => {
        Indicator.close(response.data.books)
        console.log()
        this.$store.commit(SET_PAGE_ID, n)
        this.books = response.data.books.slice(0, 20)
        this.getPage()
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

    }
  }
}
</script>
<style scoped>
.bookcate{
  background: #fbfaf8;
}
section{
	float: right;
  width: 78%;
  padding: 0 15px;
}
h2 {
  padding-left: 28px;
  margin-bottom: 5px;
  font-size: 24px;
  color: #fa7a20;
  line-height: 48px;
  font-weight: 400;
}
.book{
  height:150px;
  width: 45%;
}
.type{
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
.book{
  height:150px;
  width: 45%;
}
.booklist{
  overflow: hidden;
  width: 100%;
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
.page{
  float: right;
  width: 78%;
  display: inline-block;
  text-align: center;
}
.page li{
  display: inline-block;
  cursor: pointer;
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
