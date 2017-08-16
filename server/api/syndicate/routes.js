const express = require('express')

const router = express.Router({mergeParams: true})
const {getSyndicate, updateSyndicate} = require('./controller')
const {applyController} = require('utils/api')

router.route('/syndicate')
  .get(applyController(getSyndicate, {
    populate: {
      messages: true
    }
  }))

module.exports = router