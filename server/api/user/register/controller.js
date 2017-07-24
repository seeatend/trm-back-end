const User = require('api/user/model')

const registerUser = (body, {returnUser}) => {
  const {username, email, password, firstname, surname} = body

  return User.create({
    username, email, password, firstname, surname,
    type: 'Member'
  }).then(user => {
    if (returnUser) {
      return Promise.resolve(user)
    }
    else {
      return Promise.resolve({message: 'User has been created.'})
    }
  })
}

module.exports = {
  registerUser
}