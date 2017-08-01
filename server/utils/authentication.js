const passport = require('passport')
const jwt = require('jsonwebtoken')
const {NOT_VERIFIED, NOT_AUTHORIZED} = require('data/statusCodes')
const {VERIFICATION, AUTHENTICATION} = require('data/messages')
const {error} = require('utils/api')

const authenticate = (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user) => {
    if (err || !user) {
      return res.status(401).send(error({status: NOT_AUTHORIZED, message: AUTHENTICATION.ERROR}))
    }
    req.user = user
    next()
  })(req, res, next)
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
    return Promise.reject({status: NOT_VERIFIED, message: VERIFICATION.ERROR})
  }
}

module.exports = {
  generateToken,
  prepareUserData,
  authenticate
}