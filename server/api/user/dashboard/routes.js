const express = require('express')

const router = express.Router({mergeParams: true})
const {getDashboard} = require('./controller')

router.route('/dashboard')
  .get(getDashboard)

module.exports = router