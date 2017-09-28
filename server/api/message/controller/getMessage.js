const {prepareQuery} = require('utils/request')
const Message = require('api/message/model')
const {getUserDisplayName} = require('api/user/utils')

const availableQueries = ['horseId', '_id']

module.exports = (body, {user} = {}) => {
  let query = prepareQuery(body, availableQueries)
  if (query) {
    return Message.find(
      query,
      {__v: false, horseId: false},
      {
        limit: 20,
        sort: {createdAt: -1}
      }
    ).lean().populate(
      'userId'
    ).then(messages => {
      let messagesData = messages.map(message => {
        if (message.userId) {
          let user = message.userId
          delete message.userId
          message.author = getUserDisplayName(user)
        } else {
          message.author = 'Anonymous'
        }
        return message
      })
      return Promise.resolve(messagesData)
    })
  } else {
    return Promise.reject({message: 'Wrong parameters'})
  }
}
