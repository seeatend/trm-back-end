const express = require('express')
require('./permissions')

const router = express.Router({mergeParams: true})
const {getHorse} = require('./controller')
const {applyController} = require('utils/api')

const editRoute = require('./edit/routes')

const routePath = '/horse'

router.use(routePath, editRoute)

router.route(routePath)
  .get(
    applyController(getHorse, {
      populate: {
        messages: true,
        shares: true
      }
    })
  )

module.exports = router