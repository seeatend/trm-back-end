const mongoose = require('mongoose')
const Message = mongoose.model('Message')

exports.allMessages = function(req, res) {
  Message.find({}, function(err, task) {
    if (err)
      res.send(err)
    res.json(task)
  })
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
        console.log('save error')
        res.send(err)
      }
      res.json(elem)
    })
  }
  else {
    res.send({error: true, message: 'Missing attachment'})
  }
}