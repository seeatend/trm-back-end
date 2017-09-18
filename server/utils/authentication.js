const passport = require('passport')
const jwt = require('jsonwebtoken')
const {NOT_VERIFIED, NOT_AUTHORIZED} = require('data/statusCodes')
const {VERIFICATION, AUTHENTICATION} = require('data/messages')
const {error, bodyOrQuery} = require('utils/api')
const {isString} = require('utils/object')

const _notAuthorized = res => {
  res.status(401).send(error({status: NOT_AUTHORIZED, message: AUTHENTICATION.ERROR}))
}

const authenticate = (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user) => {
    if (err || !user) {
      _notAuthorized(res)
    } else {
      req.user = user
      next()
    }
  })(req, res, next)
}

let permissions = {}

authenticate.registerPermission = (action, promise) => {
  if (!permissions[action]) {
    permissions[action] = []
  }
  permissions[action].push(promise)
}

authenticate.can = (actions = []) => ([
  authenticate,
  (req, res, next) => {
    let body = bodyOrQuery(req)
    let {user} = req
    let validators = []
    if (isString(actions)) {
      actions = [actions]
    }
    if (actions.length === 0) {
      _notAuthorized(res)
      throw new Error('Please provide actions')
    }
    actions.forEach(action => {
      let _validators = permissions[action]
      if (_validators && _validators.length > 0) {
        validators = validators.concat(_validators)
      } else {
        _notAuthorized(res)
        throw new Error(`There is no validators for action '${action}'`)
      }
    })
    Promise.all(validators.map(validator => (validator(body, user))))
      .then(() => next())
      .catch(() => _notAuthorized(res))
  }
])

authenticate.is = type => [
  authenticate,
  (req, res, next) => {
    let {user} = req
    if (type && type.length > 0 && user.type === type) {
      next()
    } else {
      _notAuthorized(res)
    }
  }
]

const prepareUserData = (user = {}) => {
  let {avatarImage, firstname, surname, username, birthDate, location} = user

  return {
    avatarImage,
    firstname,
    surname,
    username,
    birthDate,
    location
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
  } else {
    return Promise.reject({status: NOT_VERIFIED, message: VERIFICATION.ERROR})
  }
}

module.exports = {
  generateToken,
  prepareUserData,
  authenticate
}
