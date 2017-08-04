const {prepareQuery} = require('utils/request')
const Message = require('api/message/model')

const availableQueries = ['horseId']

module.exports = (body) => {
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
          message.author = user.username || `${user.firstname} ${user.surname}`
        }
        else {
          message.author = 'Anonymous'
        }
        return message
      })
      return Promise.resolve(messagesData)
    })
  }
  else {
    return Promise.reject({message: 'Wrong parameters'})
  }
}