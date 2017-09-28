const express = require('express')

const router = express.Router({mergeParams: true})

const dashboardRoute = require('./routes/dashboard/routes')
const registerRoute = require('./routes/register/routes')
const loginRoute = require('./routes/login/routes')
const verifyRoute = require('./routes/verify/routes')
const updateRoute = require('./routes/update/routes')

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
  .get(
    authenticate,
    applyController(UserController.getUser)
  )
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
