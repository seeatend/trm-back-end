const User = require('api/user/model')

const {getMessage} = require('api/message/controller')
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
    result.messages = messages || []
    if (!options.shares) {
      return Promise.resolve()
    }
    else {
      return User.findOne(
        {name: 'demo'},
        {ownership: true}
      )
    }
  }).then(user => {
    if (user && user.ownership) {
      let ownership = user.ownership.filter(elem => {
        return elem.horse.toString() === result._id.toString()
      })
      if (ownership.length > 0 && ownership[0]) {
        result.shares = ownership[0].shares
      }
    }
    return Promise.resolve(result)
  })
}
