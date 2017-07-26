const User = require('api/user/model')
const {sendMail} = require('utils/mail')
const randomString = require('randomstring')

const registerUser = (body, {returnUser} = {}) => {
  const {username, email, password, firstname, surname} = body
  const verification = randomString.generate(80)

  return User.create({
    username, email, password, firstname, surname, verification,
    type: 'Member'
  }).then(user => {
    if (returnUser) {
      return Promise.resolve(user)
    }
    else {
      let verificationUrl = `http://localhost:8080/user/verify/${verification}`

      let mailData = {
        from: 'info@theracingmanager.com',
        to: email,
        cc: 'nick@vitaminlondon.com',
        subject: `${firstname}, please confirm your account.`,
        html: verificationUrl,
      }
      sendMail(mailData)

      return Promise.resolve({message: 'User has been created.'})
    }
  })
}

module.exports = {
  registerUser
}