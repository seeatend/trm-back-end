const express = require('express')
const {success, error} = require('utils/request')
const handleUpload = require('utils/handleUpload')

const messageRouter = express.Router({mergeParams: true})
const messageController = require('./controller')

messageRouter.route('/message')
  .get((req, res) => {
    messageController.getMessage(
      req.query
    ).then(message => {
      res.json(success(message))
    }).catch(err => {
      res.json(error(err.message))
      console.log(err.message)
    })
  })
  .post(
    handleUpload({
      field: {
        name: 'attachment',
        type: 'array',
        limit: 15
      },
      acceptedTypes: ['video', 'image', 'audio']
    }),
    messageController.createMessage)

module.exports = messageRouter