const express = require('express')

const router = express.Router({mergeParams: true})

const dashboardRoute = require('./dashboard/routes')
const registerRoute = require('./register/routes')
const loginRoute = require('./login/routes')

const routePath = '/user'

router.use(routePath, dashboardRoute)
router.use(routePath, registerRoute)
router.use(routePath, loginRoute)

module.exports = router