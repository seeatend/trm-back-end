const User = require('api/user/model')

const registerUser = (body) => {
  const {username, email, password} = body

  return User.create({
    username, email, password,
    type: 'Member'
  })
}

module.exports = {
  registerUser
}