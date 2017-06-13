const express = require('express')

const router = express.Router({mergeParams: true})
const controller = require('./controller')

router.route('/horse')
  .get(controller.getHorse)

module.exports = router