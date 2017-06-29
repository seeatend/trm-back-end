const express = require('express')

const router = express.Router({mergeParams: true})
const {searchHorse} = require('api/horse/controller')
const {applyController} = require('utils/api')

router.route('/search')
  .post(applyController(searchHorse))

module.exports = router