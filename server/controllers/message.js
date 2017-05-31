const prepareQuery = require('utils/prepareQuery')
const mongoose = require('mongoose')
const Message = mongoose.model('Message')

const availableQueries = ['horseId']

exports.getMessage = function(req, res) {
  Message.find(
    prepareQuery(req.query, availableQueries),
    function(err, task) {
      if (err)
        res.send(err)
      res.json(task)
    }
  )
}

const validateAttachment = (body) => {
  let validated = false
  const requiredProps = ['video', 'photo', 'text']
  requiredProps.forEach((propName) => {
    if (body[propName]) {
      validated = true
    }
  })
  return validated
}

exports.createMessage = function(req, res) {
  if (validateAttachment(req.body)) {
    const newMessage = new Message(req.body)

    newMessage.save(function(err, elem) {
      if (err) {
        res.send(err)
      }
      res.json(elem)
    })
  }
  else {
    res.send({error: true, message: 'Missing attachment'})
  }
}