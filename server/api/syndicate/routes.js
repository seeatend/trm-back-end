const express = require('express')

const router = express.Router({mergeParams: true})
const {getSyndicate} = require('./controller')
const editRoute = require('./edit/routes')
const {applyController} = require('utils/api')

const routePath = '/syndicate'

router.use(routePath, editRoute)

router.route(routePath)
  .get(applyController(getSyndicate, {
    populate: {
      messages: true
    }
  }))

module.exports = router
