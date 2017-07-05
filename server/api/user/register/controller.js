const User = require('api/user/model')
const {error} = require('utils/request')

const registerUser = (req, res, next) => {
  const {username, password} = req.body

  return User.register(
    new User({username, type: 'member'}),
    password,
    err => {
      if (err) {
        res.send(error(err.message))
      }
      else {
        next()
      }
    })
}

module.exports = {
  registerUser
}