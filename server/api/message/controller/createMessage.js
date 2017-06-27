const Message = require('api/message/model')


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

module.exports = (body) => {
  const newMessage = new Message(body)

  let errors = newMessage.validateSync()
  if (!errors && validateAttachment(newMessage)) {
    return newMessage.save(
    ).then(message => {
      console.log(`message received: ${message._id}`)
      return Promise.resolve()
    })
  }
  else {
    return Promise.reject()
  }
}