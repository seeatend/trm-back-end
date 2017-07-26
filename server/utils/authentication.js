const passport = require('passport')
const jwt = require('jsonwebtoken')
const {NOT_VERIFIED} = require('data/statusCodes')

const authenticate = () => {
  return passport.authenticate('jwt', {session: false})
}

const prepareUserData = (user = {}) => {
  let {firstname, surname, email, username} = user

  return {
    firstname,
    surname,
    email,
    username
  }

}

const generateToken = user => {
  if (!user.verification) {
    // Create token if the password matched and no error was thrown
    let token = jwt.sign({user: user.id}, process.env.PASSPORT_SECRET, {
      expiresIn: '5 days'
    })
    return Promise.resolve({
      token,
      user: prepareUserData(user)
    })
  }
  else {
    return Promise.reject({status: NOT_VERIFIED})
  }
}

module.exports = {
  generateToken,
  prepareUserData,
  authenticate
}