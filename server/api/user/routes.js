const express = require('express')

const router = express.Router({mergeParams: true})

const dashboardRoute = require('./dashboard/routes')

const routePath = '/user'

router.use(routePath, dashboardRoute)

module.exports = router