require('./permissions')
const express = require('express')
const {applyController} = require('utils/api')
const handleUpload = require('utils/handleUpload')

const commentRoute = require('./comment/routes')

const router = express.Router({mergeParams: true})
const {getMessage, createMessage} = require('./controller')
const {authenticate} = require('utils/authentication')

const routePath = '/message'

router.use(routePath, commentRoute)

router.route(routePath)
.get(
  authenticate.read('horse'),
  applyController(getMessage)
)
.post(
  authenticate,
  handleUpload({
    field: {
      name: 'attachment',
      type: 'array',
      limit: 15
    },
    acceptedTypes: ['video', 'image', 'audio'],
    destination: 'messages'
  }),
  applyController(createMessage)
)

module.exports = router