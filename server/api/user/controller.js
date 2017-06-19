const User = require('./model')

const getUser = (query, omit) => {
  return User.findOne(
    {name: 'demo'},
    {__v: false, _id: false}
  ).populate('ownership.horse', omit)
}

module.exports = {
  getUser
}