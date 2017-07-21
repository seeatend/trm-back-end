const passport = require('passport')
const User = require('api/user/model')
const jwt = require('jsonwebtoken')

const loginUser = (body) => {
  let {email, password} = body
  if (!email || !password) return Promise.reject({
    message: 'Provide email and password.'
  })
  let user
  return User.findOne({email})
    .then(_user => {
      user = _user
      if (!user || !user.email) {
        return Promise.reject({
          message: 'Authentication failed. User not found.'
        })
      }
      else {
        // Check if password matches
        return user.validatePassword(password)
      }
    })
    .then(() => {
      // Create token if the password matched and no error was thrown
      let token = jwt.sign(user, process.env.PASSPORT_SECRET, {
        expiresIn: '2 days'
      })
      return Promise.resolve({
        message: 'Authentication successfull',
        token
      })
    })
}

module.exports = {
  loginUser
}