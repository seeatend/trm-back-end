const User = require('./model')
const {success, error} = require('utils/request')

exports.get = () => {
  return User.findOne(
    {name: 'demo'},
    {__v: false, _id: false}
  ).populate('ownership.horse')
}