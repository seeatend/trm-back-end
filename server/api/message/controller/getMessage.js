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
    )
  }
  else { return Promise.reject({message: 'Wrong parameters'})}
}