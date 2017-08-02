const User = require('./model')

const removeUser = (body = {}) => {
  return User.remove(body)
}

const getUser = ({filter = {__v: false, _id: false}, populate = true, omit}) => {
  let result = User.findOne(
    {firstname: 'demo'},
    filter
  )
  return populate ? result.populate('ownership.horse', omit) : result
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