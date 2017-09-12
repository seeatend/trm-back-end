const User = require('api/user/model')
const {generateToken} = require('utils/authentication')

const verifyUser = (body) => {
  if (!body.token) return Promise.reject()

  return User.findOneAndUpdate({
    verification: body.token
  }, {
    $unset: {
      verification: 1
    }
  }, {
    new: true
  }).then(user => {
    if (user) {
      return generateToken(user)
    } else {
      return Promise.reject()
    }
  })
}

module.exports = {
  verifyUser
}
