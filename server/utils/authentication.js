const passport = require('passport')
const jwt = require('jsonwebtoken')
const {NOT_VERIFIED} = require('data/statusCodes')

const authenticate = () => {
  return passport.authenticate('jwt', {session: false})
}

const generateToken = user => {
  if (!user.verification) {
    // Create token if the password matched and no error was thrown
    let token = jwt.sign({user: user.id}, process.env.PASSPORT_SECRET, {
      expiresIn: '2 days'
    })
    let {firstname, surname, email, username} = user
    return Promise.resolve({
      token,
      user: {
        firstname,
        surname,
        email,
        username
      }
    })
  }
  else {
    return Promise.reject({status: NOT_VERIFIED})
  }
}

module.exports = {
  generateToken,
  authenticate
}