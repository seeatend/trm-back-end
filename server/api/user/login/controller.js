const passport = require('passport')
const {success} = require('utils/request')

const loginUser = (req, res) => {
  return passport.authenticate('local')(req, res, () => {
    res.send(success('Successfully logged in'))
  })
}

module.exports = {
  loginUser
}