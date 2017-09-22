const {Controller} = require('api/utils')
const NewsModel = require('api/news/model')

const NewsController = new Controller({
  model: NewsModel,
  methods: {
    getNews: require('./getNews')
  }
})

module.exports = NewsController
