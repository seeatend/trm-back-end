const express = require('express')
const router = express.Router({mergeParams: true})

const {applyController} = require('utils/api')
const {getDashboard} = require('./controller')

router.route('/dashboard')
  .get(applyController(getDashboard))

module.exports = router