const Message = require('api/message/model')
const {MESSAGE} = require('data/messages')

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

module.exports = (body, options = {}) => {
  const newMessage = new Message(body)
  const {user} = options

  if (user) {
    newMessage.userId = user._id
  }

  let errors = newMessage.validateSync()
  if (!errors && validateAttachment(newMessage)) {
    return newMessage.save(
    ).then(() => {
      return Promise.resolve(MESSAGE.SUCCESS)
    })
  } else {
    return Promise.reject()
  }
}
