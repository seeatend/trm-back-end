const express = require('express')
const {applyController} = require('utils/api')
const handleUpload = require('utils/handleUpload')

const messageRouter = express.Router({mergeParams: true})
const {getMessage, createMessage} = require('./controller')
const {authenticate} = require('utils/authentication')

messageRouter.route('/message')
  .get(
    authenticate.read('horse'),
    applyController(getMessage)
  )
  .post(
    authenticate.write('horse'),
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

module.exports = messageRouter