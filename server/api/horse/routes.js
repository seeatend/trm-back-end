const express = require('express')
require('./permissions')

const router = express.Router({mergeParams: true})
const {getHorse} = require('./controller')
const {applyController} = require('utils/api')

router.route('/horse')
  .get(
    applyController(getHorse, {
      populate: {
        messages: true,
        shares: true
      }
    })
  )

module.exports = router