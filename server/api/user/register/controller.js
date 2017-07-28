const User = require('api/user/model')
const {sendMail} = require('utils/email')
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
      let baseUrl = isDev ? 'localhost:8080' : 'uat.theracingmanager.com'
      let verificationUrl = `http://${baseUrl}/user/verify/${verification}`

      let mailData = {
        from: 'noreply@theracingmanager.com',
        to: email,
        subject: `The Racing Manager email verification`,
        template: {
          name: 'verification',
          data: {
            firstname,
            url: verificationUrl
          }
        },
      }
      if (isDev) {
        mailData.to = `${nodeEnv === 'local' ? 'chris' : 'nick'}@vitaminlondon.com`
      }
      sendMail(mailData)

      return Promise.resolve({message: 'User has been created.'})
    }
  })
}

module.exports = {
  registerUser
}