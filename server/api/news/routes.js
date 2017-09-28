const express = require('express')

const router = express.Router({mergeParams: true})
const NewsController = require('api/news/controller')
const {applyController} = require('utils/api')

const routePath = '/news'

router.route(routePath)
  .get(
    applyController(NewsController.getNews)
  )

module.exports = router
