const express = require('express')
const router = express.Router({mergeParams: true})

const {updateUser} = require('./controller')
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')

router.route('/update')
  .post(
    authenticate.is('admin'),
    applyController(updateUser)
  )

module.exports = router