const User = require('api/user/model')

const registerUser = (body) => {
  const {username, email, password, firstname, surname} = body

  return User.create({
    username, email, password, firstname, surname,
    type: 'Member'
  }).then(() => {
    return Promise.resolve({message: 'User has been created.'})
  })
}

module.exports = {
  registerUser
}