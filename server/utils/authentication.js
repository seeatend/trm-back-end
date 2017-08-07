const passport = require('passport')
const jwt = require('jsonwebtoken')
const {NOT_VERIFIED, NOT_AUTHORIZED} = require('data/statusCodes')
const {VERIFICATION, AUTHENTICATION} = require('data/messages')
const {error, getReqBody} = require('utils/api')

const _notAuthorized = res => {
  res.status(401).send(error({status: NOT_AUTHORIZED, message: AUTHENTICATION.ERROR}))
}

const authenticate = (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user) => {
    if (err || !user) {
      _notAuthorized(res)
    }
    else {
      req.user = user
      next()
    }
  })(req, res, next)
}

let permissions = {
  write: {},
  read: {}
}

authenticate.registerPermission = (action, resource, promise) => {
  if (['write', 'read'].indexOf(action) >= 0) {
    if (!permissions[action][resource]) {
      permissions[action][resource] = []
    }
    permissions[action][resource].push(promise)
  }
}

authenticate.can = (action, resource) => ([
  authenticate,
  (req, res, next) => {
    let body = getReqBody(req)
    let {user} = req
    let middleware = permissions[action][resource]
    let promises = Promise.resolve
    if (middleware && middleware.length > 0) {
      promises = Promise.all(middleware.map(promise => (promise(body, user))))
    }
    promises
      .then(() => next())
      .catch(() => _notAuthorized(res))
  }
])

authenticate.write = resource => (authenticate.can('write', resource))
authenticate.read = resource => (authenticate.can('read', resource))

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