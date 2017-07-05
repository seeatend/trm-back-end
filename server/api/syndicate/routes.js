const express = require('express')

const router = express.Router({mergeParams: true})
const {getSyndicate} = require('./controller')
const {applyController} = require('utils/api')

router.route('/syndicate')
  .get(applyController(getSyndicate))

module.exports = router