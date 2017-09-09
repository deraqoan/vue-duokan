import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Home = resolve => require(['@/components/Home'], resolve)
const Book = resolve => require(['@/components/common/Book'], resolve)
const ReadBook = resolve => require(['@/components/book/ReadBook'], resolve)
const ChangeSource = resolve => require(['@/components/book/ChangeSource'], resolve)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/readbook/:bookId',
      name: 'readbook',
      component: ReadBook
    }, {
      path: '/book/:bookId',
      name: 'book',
      component: Book
    }, {
      path: '/changeSource/:bookId',
      name: 'changeSource',
      component: ChangeSource
    }
  ]
})
