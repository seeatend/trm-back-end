const {authenticate} = require('utils/authentication')
const Message = require('api/message/model')

const ownsHorseByHorseId = (body, user) => {
  let {horseId} = body
  if (horseId) {
    let matches = user.ownership.filter(e => (e.horse.toString() === horseId.toString()))
    if (matches.length > 0) {
      return Promise.resolve()
    }
  }
  return Promise.reject()
}

const ownsHorseByMessageId = (body, user) => {
  let {messageId} = body

  if (messageId) {
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

const ownsHorse = (body, user) => {
  let {horseId, messageId} = body
  if (horseId) {
    return ownsHorseByHorseId(body, user)
  } else if (messageId) {
    return ownsHorseByMessageId(body, user)
  } else {
    return Promise.reject()
  }
}

authenticate.registerPermission('get horse', ownsHorseByHorseId)
authenticate.registerPermission('post horse', ownsHorseByHorseId)

module.exports = {
  ownsHorse,
  ownsHorseByMessageId,
  ownsHorseByHorseId
}
