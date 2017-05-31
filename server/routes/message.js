const express = require('express')

const messageRouter = express.Router({mergeParams: true})
const messageController = require('controllers/message');

messageRouter.route('/message')
  .get(messageController.allMessages)
  .post(messageController.createMessage)

module.exports = messageRouter