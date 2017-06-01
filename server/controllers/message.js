const {prepareQuery, processFiles} = require('utils/request')
const mongoose = require('mongoose')
const Message = mongoose.model('Message')

const availableQueries = ['horseId', 'trainerId']

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
    if (body[propName] && body[propName].length > 0) {
      validated = true
    }
  })
  return validated
}

exports.createMessage = function(req, res) {
  const { body, files } = req
  const newMessage = new Message(body)

  let errors = newMessage.validateSync()
  if (!errors) {
    const messagePath = `${body.horseId}/${Date.now()}`
    const attachment = processFiles(files, messagePath)

    if (validateAttachment(attachment)) {
      Object.assign(newMessage, attachment)

      newMessage.save(function(err, elem) {
        if (err) {
          res.send(err)
        }
        console.log(`message received: ${elem._id}`)
        res.json(elem)
      })
    }
  }
  else {
    res.send({error: true, message: 'Wrong parameters'})
  }
}