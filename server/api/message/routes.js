const express = require('express')
const {success, error} = require('utils/request')
const handleUpload = require('utils/handleUpload')

const messageRouter = express.Router({mergeParams: true})
const {getMessage, createMessage} = require('./controller')

messageRouter.route('/message')
  .get((req, res) => {
    getMessage(
      req.query
    ).then(message => {
      res.json(success(message))
    }).catch(err => {
      res.status(404).json(error(err.message))
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
    (req, res) => {
      const {body, files} = req
      createMessage(
        body, files
      ).then(() => {
        res.send(success())
      }).catch(err => {
        res.status(404).send(error())
      })
    })

module.exports = messageRouter