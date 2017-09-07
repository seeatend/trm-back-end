const User = require('api/user/model')
const {AUTHENTICATION} = require('data/messages')
const {generateToken} = require('utils/authentication')

const loginUser = (body) => {
  let {email, password} = body
  if (!email || !password) {
    return Promise.reject({
      message: 'Provide email and password.'
    })
  }
  let user
  return User.findOne({email})
    .then(_user => {
      user = _user
      if (!user || !user.email) {
        return Promise.reject({message: AUTHENTICATION.ERROR})
      } else {
        // Check if password matches
        return user.validatePassword(password)
      }
    })
    .then(() => {
      return generateToken(user)
    })
}

module.exports = {
  loginUser
}
