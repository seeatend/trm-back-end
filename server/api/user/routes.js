const express = require('express')

const router = express.Router({mergeParams: true})

const dashboardRoute = require('./dashboard/routes')
const registerRoute = require('./register/routes')
const loginRoute = require('./login/routes')
const verifyRoute = require('./verify/routes')
const updateRoute = require('./update/routes')

const routePath = '/user'

router.use(routePath, dashboardRoute)
router.use(routePath, registerRoute)
router.use(routePath, loginRoute)
router.use(routePath, verifyRoute)
router.use(routePath, updateRoute)

module.exports = router