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

const handleUpload = require('utils/handleUpload')

const {applyController} = require('utils/api')
const UserController = require('api/user/controller')
const {authenticate} = require('utils/authentication')
const {bodySelect} = require('utils/request')

router.route(routePath)
  .put(
    authenticate,
    handleUpload({
      fields: {
        avatarImage: {
          type: 'image'
        }
      },
      destination: 'users'
    }),
    bodySelect([
      'avatarImage',
      'firstname',
      'surname',
      'username',
      'birthDate',
      'location'
    ]),
    applyController(UserController.updateUser)
  )

module.exports = router
