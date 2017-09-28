const {authenticate} = require('utils/authentication')
const {isMongoId} = require('utils/object')
const Message = require('api/message/model')

const ownsHorseByHorseId = (body, user) => {
  let {horseId} = body
  if (isMongoId(horseId)) {
    let matches = user.ownership.filter(e => (e.horse.toString() === horseId.toString()))
    if (matches.length > 0) {
      return Promise.resolve()
    }
  }
  return Promise.reject()
}

const ownsHorseByMessageId = (body, user) => {
  let {messageId} = body

  if (isMongoId(messageId)) {
    return Message.findOne(
      {_id: messageId}
    ).then(message => {
      if (message && message.horseId) {
        return ownsHorseByHorseId(
          {horseId: message.horseId},
          user
        )
      } else {
        return Promise.reject()
      }
    })
  } else {
    return Promise.reject()
  }
}

authenticate.registerPermission('get horse', ownsHorseByHorseId)
authenticate.registerPermission('post horse', ownsHorseByHorseId)

module.exports = {
  ownsHorseByMessageId,
  ownsHorseByHorseId
}
