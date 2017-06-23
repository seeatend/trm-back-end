const {prepareQuery} = require('utils/request')
const Message = require('api/message/model')

const availableQueries = ['horseId']

module.exports = (query) => {
  let _query = prepareQuery(query, availableQueries)
  if (_query) {
    return Message.find(
      _query,
      {__v: false, horseId: false},
      {
        limit: 20,
        sort: {createdAt: -1}
      }
    )
  }
  else { return Promise.reject({message: 'Wrong parameters'})}
}