<template>
	<li @click="getBook()">
		<img :src="imgUrl">
		<div class="book-info">
			<h3 class="book-title">{{book.title}}</h3>
			<p class="book-author">{{book.author}}</p>
			<h5 class="short-intro">{{book.shortIntro}}</h5>
			<p class="reader-info">{{latelyFollower}}万人气 | {{book.retentionRatio}}%读者留存</p>
		</div>
	</li>
</template>

<script>
import api from '@/api/api'
import util from '@/utils/util'
import { SET_BACK_POSITION, SET_PAGE_ID } from '@/store/mutationsType'

export default {
  name: 'Bookslist',
  data () {
    return {

    }
  },
  props: ['book'],
  computed: {
    latelyFollower () {
      return (this.book.latelyFollower / 10000).toFixed(1)
    },
    imgUrl () {
      return util.staticPath + this.book.cover
    }
  },
  methods: {
    getBook () {
      this.$store.commit(SET_BACK_POSITION, '')
      this.$router.push('/book/' + this.book._id)
      api.getMixSource(this.book._id).then(response => {
        this.$store.commit(SET_CURRENT_SOURCE, response.data[0]._id)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
	float: left;
    width: 96px;
    height: 128px;
    box-shadow: 5px 5px 8px #ccc;
}

li {
	position: relative;
	float: left;
	height:150px;
	width: 340px;
	margin:10px;
	padding: 0 44px 30px 0;
}

li:active,
li:focus {
	background: #f2f2f2;
}

.book-info {
	height: 120px;
	margin-left: 115px;
}

.book-title {
	font-weight: bold;
    line-height: 22px;
    font-size: 22px;
    margin: 3px 0 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #613f23;
}

.short-intro {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: #613f23;
	font-weight: bold;
}

.book-author {
	color: #613f23;
	height: 28px;
	font-weight: bold;
  line-height: 28px;
}

.book-info .reader-info {
	font-weight: bold;
	height: 20px;
	line-height: 20px;
	color: #613f23;
	text-overflow: ellipsis;
	overflow: hidden;
	font-size: 12px;
}
</style>
