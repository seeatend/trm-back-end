const {getMessage} = require('api/message/controller')
const {getShares} = require('api/user/controller')
const getHorse = require('./getHorse')

module.exports = (body, options = {}) => {
  let result
  return getHorse(
    body
  ).then(horse => {
    result = horse
    if (!options.messages) {
      return Promise.resolve()
    }
    else {
      return getMessage(
        {horseId: horse._id}
      )
    }
  }).then(messages => {
    result.messages = messages
    if (!options.shares) {
      return Promise.resolve()
    }
    else {
      return getShares({
        horseId: result._id
      })
    }
  }).then(shares => {
    if (shares) result.shares = shares
    return Promise.resolve(result)
  })
}
