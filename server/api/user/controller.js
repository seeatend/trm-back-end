const User = require('./model')
const {METHODS} = require('data/messages')

const removeUser = (body = {}) => {
  return User.remove(body)
}

const getUser = (body) => {
  return User.findOne(
    body
  ).then(user => {
    if (user) return Promise.resolve(user)
    else return Promise.reject({
      message: METHODS.USER.NOT_FOUND(body.email)
    })
  })
}

const getShares = (query, {user} = {}) => {
  if (user && user.ownership) {
    let ownership = user.ownership.filter(elem => {
      return elem.horse.toString() === query.horseId.toString()
    })
    if (ownership.length > 0 && ownership[0]) {
      return Promise.resolve(ownership[0].shares)
    }
  }
  return Promise.resolve()
}

module.exports = {
  getUser,
  getShares,
  removeUser
}