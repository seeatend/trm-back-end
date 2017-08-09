const User = require('api/user/model')
const {getUser} = require('api/user/controller')
const {getHorse} = require('api/horse/controller')
const {isString} = require('utils/object')

const updateUser = (body, {user} = {}) => {
  const {email, horse} = body

  if (!(email && email.length > 0)) {
    return Promise.reject({message: 'Please provide at least one email(comma separated)'})
  }

  if (!(horse && horse.length > 0)) {
    return Promise.reject({message: 'Please provide at least one horse(comma separated)'})
  }

  let emails = email.split(',')
  let horses = horse.split(',')

  let users

  return Promise.all(
    emails.map(e => (
      getUser({email: e.trim()}))
    )
  ).then(_users => {
    users = _users
    return Promise.all(
      horses.map(h => (getHorse({name: h.toUpperCase()})))
    )
  }).then(horses => {
    let promises = []
    users.forEach(user => {
      horses.forEach(horse => {
        user.addShare({horse})
      })
      promises.push(user.save())
    })
    return Promise.all(promises)
  }).then(() => Promise.resolve())
}

module.exports = {
  updateUser
}