const {getMessage} = require('api/message/controller')
const {getShares} = require('api/user/controller')
const getHorse = require('./getHorse')

// TODO: Split this into two methods: 'getPublicHorse' and 'getPrivateHorse'

module.exports = (body, options = {}) => {
  const {populate = {}} = options
  let result
  return getHorse(
    body
  ).then(horse => {
    result = horse
    if (!populate.messages) {
      return Promise.resolve()
    } else {
      return getMessage(
        {horseId: horse._id}
      )
    }
  }).then(messages => {
    result.messages = messages
    if (!populate.shares) {
      return Promise.resolve()
    } else {
      return getShares({
        horseId: result._id,
        options
      })
    }
  }).then(shares => {
    if (shares) result.shares = shares
    return Promise.resolve(result)
  })
}
