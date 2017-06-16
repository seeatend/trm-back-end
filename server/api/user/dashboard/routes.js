const express = require('express')

const router = express.Router({mergeParams: true})
const controller = require('./controller')

router.route('/dashboard')
  .get(controller.getDashboard)

module.exports = router