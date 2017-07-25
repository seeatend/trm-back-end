const User = require('api/user/model')

const verifyUser = (body) => {
  return User.findOneAndUpdate({
    verification: body.token
  }, {
    $unset: {
      verification: 1
    }
  })
}

module.exports = {
  verifyUser
}