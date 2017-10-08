const express = require('express')
const router = express.Router({mergeParams: true})
const {joinHorse} = require('./controller')
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')

router.route('/join')
  .post(authenticate, applyController(joinHorse))

module.exports = router
