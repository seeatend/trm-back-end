const express = require('express')
const router = express.Router({mergeParams: true})

const {applyController} = require('utils/api')
const HorseController = require('api/horse/controller')
const {authenticate} = require('utils/authentication')
const {assignQueryToBody} = require('utils/request')

router.route('/edit')
  .post(
    assignQueryToBody,
    authenticate.is('admin'),
    applyController(HorseController.updateByName)
  )

module.exports = router