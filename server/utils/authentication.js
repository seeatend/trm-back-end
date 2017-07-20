const passport = require('passport')

const authenticate = () => {
  return passport.authenticate('jwt', { session: false })
}

module.exports = {
  authenticate
}