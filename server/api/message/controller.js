const {prepareQuery, processFiles} = require('utils/request')
const mongoose = require('mongoose')
const Message = require('./model')

const availableQueries = ['horseId', 'trainerId']

exports.getMessage = function(req, res) {
  Message.find(
    prepareQuery(req.query, availableQueries),
    {__v: false, _id: false},
    {
      limit: 20,
      sort: {createdAt: -1}
    },
    function(err, task) {
      if (err)
        res.send(err)
      res.json(task)
    }
  )
}

const validateAttachment = (body) => {
  let validated = false
  const requiredProps = ['attachment', 'text']
  requiredProps.forEach((propName) => {
    if (body[propName] && body[propName].length > 0) {
      validated = true
    }
  })
  return validated
}

exports.createMessage = function(req, res) {
  const {body, files} = req
  const newMessage = new Message(body)

  let errors = newMessage.validateSync()
  if (!errors) {
    const messagePath = `${body.horseId}/${Date.now()}`
    const attachment = processFiles(files, messagePath)

    if (attachment.error) {
      res.json(attachment)
    }
    else {
      newMessage.attachment = attachment

      if (validateAttachment(newMessage)) {

        newMessage.save(function(err, elem) {
          if (err) {
            console.log('error while saving message')
            res.send(err)
          }
          else {
            console.log(`message received: ${elem._id}`)
            res.send({error: false})
          }
        })
      }
      else {
        res.send({error: true, message: 'Wrong parameters'})
      }
    }
  }
  else {
    res.send({error: true, message: 'Wrong parameters'})
  }
}