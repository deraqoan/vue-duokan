<template>
  <div class="shelf">
    <div class="col-md-3">
    <section v-for="(item ,key, index) in category" :key="index" v-if="categoryType[key]">
      <div class="mtitle" @click="gotogory">
      <img src="../../assets/male.png" class="icon" v-if="index===0">
      <img src="../../assets/female.png" class="icon" v-if="index===1">
      <img src="../../assets/manhua.png" class="icon" v-if="index===2">
      <img src="../../assets/pulish.png" class="icon" v-if="index===3">
      <p class="category-type">{{categoryType[key]}}</p>
      <a class="more">更多></a>
    </div>
      <ul>
        <li v-for="(cat, index) in item" :key="index" @click="gotogory" v-if="index<9&&key">
          <p class="category">{{cat.name}}</p>
          <span class="book-count">{{cat.bookCount}}</span>
        </li>
      </ul>
    </section>
    <section>
      <div class="mtitle">
      <img src="../../assets/rank.png" class="icon">
      <p class="category-type">排行榜</p>
      <span class="more">更多></span>
    </div>
    <div class="rank">
      <span class="malerank" @click="goPaget">男生榜</span>
      <span class="verticaleLine">|</span>
      <span class="femalerank" @click="goPage">女生榜</span>
    </div>
      <ul class="book-list">
        <li v-for="(book, index) in ranks" :book="book" :key="book._id"  @click="getBook(book._id)" class="rankbox">
          <em class="tagname">{{index+1}}</em>
          <img :src="imgUrl" v-if="index===0" class="cover">
          <p class="ranktitle">{{book.title}}</p>
          <p class="rankauthor">{{book.author}}</p>
        </li>
      </ul>
    </section>
  </div>
  <div class="col-md-8">
    <div class="right">
      <div class="index-wrap">
          <transition-group tag='ul' class="slide" name="image">
            <li v-for="(item, index) in slides" :key="index"  v-show="index===nowIndex">
              <a>
                  <img :src="item.img" class="slideimg">
              </a>
            </li>
          </transition-group>
          <div class="slide-pages">
            <span v-for="(item, index) in slides" @click="goto(index)" :key="index" v-bind:class="{'active':index===nowIndex}">
            </span>
          </div>
        </div>
    <div class="container">
    <div class="zhongtui">
      <div class="utitle"><h5>重磅推荐</h5></div>
        <ul class="book-list">
          <Booklist v-for="book in books[3]" :book="book" :key="book._id" class="book"></Booklist>
        </ul>
    </div>
    <div class="zhongtui">
      <div class="utitle"><h5>出版精品</h5></div>
        <ul class="book-list">
          <Booklist v-for="book in books[2]" :book="book" :key="book._id" class="book"></Booklist>
        </ul>
    </div>
    <div class="zhongtui">
      <div class="utitle"><h5>男生精选</h5></div>
        <ul class="book-list">
          <Booklist v-for="book in books[0]" :book="book" :key="book._id" class="book"></Booklist>
        </ul>
    </div>
    <div class="zhongtui">
      <div class="utitle"><h5>女生精选</h5></div>
        <ul class="book-list">
          <Booklist v-for="book in books[1]" :book="book" :key="book._id" class="book"></Booklist>
        </ul>
    </div>
    </div>
  </div>
  </div>
  <div class="col-md-12">
    <div class="hot-items">
      <li v-for="(item, index) in slides" :key="index"  class="col-md-4">
        <a>
            <img :src="item.img"  class="hotitem">
        </a>
      </li>
    </div>
    <div class="hang">
      <div class="items">
        <div class="mtitle">
        <img src="../../assets/female.png" class="icon">
        <p class="category-type">女频完本</p>
        <span class="more">更多></span>
      </div>
      <ul>
        <Booklist v-for="book in books[6]" :book="book" :key="book._id" class="book"></Booklist>
      </ul>
    </div>
    <div class="items">
        <div class="mtitle">
        <img src="../../assets/female.png" class="icon">
        <p class="category-type">男频完本</p>
        <span class="more">更多></span>
      </div>
      <ul>
        <Booklist v-for="book in books[7]" :book="book" :key="book._id" class="book"></Booklist>
      </ul>
    </div>
    <div class="items">
        <div class="mtitle">
        <img src="../../assets/female.png" class="icon">
        <p class="category-type">男频新本</p>
        <span class="more">更多></span>
      </div>
      <ul>
        <Booklist v-for="book in books[4]" :book="book" :key="book._id" class="book"></Booklist>
      </ul>
    </div>
    <div class="items">
        <div class="mtitle">
        <img src="../../assets/female.png" class="icon">
        <p class="category-type">女频新本</p>
        <span class="more">更多></span>
      </div>
      <ul>
        <Booklist v-for="book in books[5]" :book="book" :key="book._id" class="book"></Booklist>
      </ul>
    </div>
  </div>
</div>
  </div>
</template>
<script>
import api from '@/api/api'
import axios from 'axios'
import Booklist from '@/components/common/Booklist'
import { SET_BACK_POSITION, SET_CURRENT_SOURCE } from '@/store/mutationsType'
import { Indicator } from 'mint-ui'

export default {
  name: 'Booksheft',
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
      moreType: [
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
      slides: [],
      nowIndex: 0,
      books: [],
      pulish: [],
      nv: [],
      nan: [],
      malefinish: [],
      femalefinish: [],
      ranks: []
    }
  },
  created () {
    this.play()
    this.getRankList('54d42d92321052167dfb75e3')

    api.getCategory().then(response => {
      this.category = response.data
      this.loading = false
    }).catch(err => {
      console.log(err)
    })

    axios.get('http://www.zhuishushenqi.com/spread').then(response => {
      this.slides = response.data.data
      this.loading = false
    }).catch(err => {
      console.log(err)
    })

    this.getNovelListByCat()
  },
  computed: {
    imgUrl () {
      return 'http://statics.zhuishushenqi.com' + this.ranks[0].cover
    }
  },
   methods: {
      getRankList(ranktype){
        api.getRankList(ranktype).then(response => {
          console.log(this.rank)
          this.ranks = response.data.ranking.books.slice(0, 14)
          Indicator.close()
        }).catch(error => {
          Indicator.close()
          console.log(error)
        })
      },
      getNovelListByCat () {
        Indicator.open('加载中')
        for (var i = 0; i < this.moreType.length; i++) {
          api.getNovelListByCat(this.moreType[i].gender, this.moreType[i].type, this.moreType[i].major, this.moreType[i].minor).then(response => {
            Indicator.close()
            this.books.push(response.data.books.slice(8, 12))
          }).catch(err => {
            console.log(err)
          })
        };
      },
      goPage () {
        this.getRankList('54d43437d47d13ff21cad58b')
      },
      goPaget () {
        this.getRankList('54d42d92321052167dfb75e3')
      },
      goPagec () {
        this.$router.push('/')
        this.$store.commit(SET_BACK_POSITION, '分类')
      },
      gotogory () {
        this.$router.push('/')
        this.$store.commit(SET_BACK_POSITION, '分类')
      },
      goto (index) {
        this.nowIndex = index
      },
      getBook (id) {
        this.$store.commit(SET_BACK_POSITION, '首页')
        this.$router.push('/book/' + id)
        api.getMixSource(id).then(response => {
          this.$store.commit(SET_CURRENT_SOURCE, response.data[0]._id)
        }).catch(err => {
          console.log(err)
        })
      },
      autoPlay () {
        this.nowIndex++
        if(this.nowIndex===3){
          this.nowIndex = 0
          return
        }
      },
      play() {
        setInterval(this.autoPlay, 3000)
      }
    },
}
</script>
<style scoped>
.shelf{
   background: #fbfaf8;
}
section{
   padding: 0 15px;
   margin-bottom: 10px;
   border: 1px solid #eee;
   z-index: 100;
}
section ul {
  display: inline-block;
  width: 100%;
  padding: 12px 0;
}
li{
  cursor: pointer;
}
section ul li {
  float: left;
  display: block;
  width: 33.3333%;
  line-height: 18px;
  padding: 2px 0;
  
}
.mtitle{
  width: 100%;
  height: 50px;
  display: inline-block;
  line-height: 50px;
  border-bottom: 1px solid #eee;

}
.icon{
  height: 20px;
  float: left;
  height: 20px;
  margin-top:15px;
  margin-right: 10px;
}
.category {
  font-weight: bold;
  color:#666;
  font-size: 13px;
  margin-bottom: 0.1rem;
  margin-top: 0.8rem;
  line-height: 1.3rem;
}
.more{
  color: #999;
  margin-top:-60px;
  float: right;
  font-size: 12px;
  font-weight: 200;
}
.category-type {
    font-size: 18px;
    color: #333;
    line-height: 50px;
    font-weight: 700;
}
.book-count{
  color: #999;
  font-size: 12px
}
.cover{
  width: 70px;
  height: 85px;
}
.rankbox{
  float: left;
  display: block;
  width: 100%;
  height: 40px;
  line-height: 20px;
  margin-bottom: 13px;
}
.rankbox:nth-child(1){
  height: 90px;
}
.rankbox:nth-child(1) .ranktitle, .rankbox:nth-child(1) .rankauthor{
  float: right;
  position: absolute;
  margin-left: 20px;
  margin-top: 20px;
  display: inline-block;
  width: 100px;
}
.rankbox:nth-child(1) .rankauthor{
  margin-top: 40px;
}
.ranktitle{
  font-size: 14px;
  color: #666;
  margin-left: 15px;
  margin-top: 5px;
  line-height: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rankauthor{
  line-height: 6px;
  color: #999;
  margin-left: 15px;
  margin-top: 5px;
  font-size: 12px;
}
.tagname{
  position: absolute;
  margin-top: 1px;
  margin-left: 0;
  width: 20px;
  text-align: center;
  font: 400 14px/20px 'Century Gothic';
}
.slide{
  overflow:hidden;
  width: 780px;
  left: 0;
  position: absolute;
  height: 264px;
}
.slide li{
  float:left;
  top:0;
  width: 780px;
  height: 264px;
  position: absolute;
  overflow:hidden;
}
.slideimg{
  width: 780px;
  height: 264px;
  overflow:hidden;
 }
.index-wrap {
  overflow: hidden;
  cursor: pointer;
  height: 240px;
  width: 780px;
  z-index: 1;
}
.slide-pages {
  position: absolute;
  right: 0;
  left: 0;
  top: 230px;
  text-align: center;
  font-size: 0;
  height: 8px;
}
.slide-pages span {
  display: inline-block;
  margin: 0 4px;
  width: 8px;
  height: 8px;
  margin-bottom: 2rem;
  border-radius: 50%;
  background: #ccc;
}
.active{
  background: red;
}
.image-enter {
  transform: translateX(100%);
}
.image-leave {
  transform: translateX(0);
}
.booklist{
  overflow: hidden;
  width: 100%;
}
.zhongtui{
  top:270px;  
  width: 800px;
}
.utitle{
  color: #ec6e00;
  position: relative;
  height: 60px;
  width: 730px;
  border-bottom: 1px solid #e0dad5;
  overflow: hidden;
  line-height: 55px;
}
.utitle h5{
  width: 130px;
  height: 55px;
  line-height: 35px;
  color: #333;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
}
.utitle:before {
    content: '';
    display: block;
    width: 100%;
    height: 5px;
    background: #fa7a20;
}
.utitle h5:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 130px;
    height: 5px;
    background: #fa7a20;
}
.rank{
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.rank span{
  font-size: 16px;
    color: #999;
    cursor: pointer;
}
.container{
  position: absolute;
  top:280px;
}
.hot-items{
  height: 130px;
  margin: 10px auto;
}
.hang{
  width: 100%;
  margin: 0;
  height: 100%;
}
.hang ul{
  width: 100%;
  margin: 0;
  padding: 0;
}
.items{
  width: 50%;
  float: left;
}
.items .book{
  width: 50%;
  margin-left:10%;
}
.rank .book{
  width: 210px;
}
.hotitem{
  float: left;
  width: 320px;
  margin-right:5px;
  height: 130px;
  border-radius: 4px;
}
</style>
