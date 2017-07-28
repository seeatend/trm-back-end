const User = require('api/user/model')
const {sendMail} = require('utils/email')
const randomString = require('randomstring')
const {REGISTER} = require('data/messages')

const createUser = body => {
  const {username, email, password, firstname, surname} = body
  const verification = randomString.generate(80)

  return User.create({
    username, email, password, firstname, surname, verification,
    type: 'Member'
  }).then(() => {
    return Promise.resolve(verification)
  })
}

const registerUser = body => {
  const {email, firstname} = body

  return createUser(body).then(verification => {
    let baseUrl = isDev ? '52.209.171.180:3000' : 'uat.theracingmanager.com'
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

    return Promise.resolve({message: REGISTER.SUCCESS})
  })
}

module.exports = {
  createUser,
  registerUser
}