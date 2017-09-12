const User = require('api/user/model')
const {sendMail} = require('utils/email')
const randomString = require('randomstring')
const {REGISTER} = require('data/messages')
const {randomInteger} = require('utils/math')
const {getRandomHorse} = require('api/horse/controller')
const {removeEmpty, safeTrim} = require('utils/object')

const createUser = body => {
  const {username, email, password, firstname, surname} = body
  const verification = randomString.generate(80)
  let user

  return User.create(removeEmpty({
    username: safeTrim(username),
    email: safeTrim(email),
    password: safeTrim(password),
    firstname: safeTrim(firstname),
    surname: safeTrim(surname),
    // verification,
    type: 'member'
  })).then(_user => {
    user = _user
    if (global.isDev) {
      return getRandomHorse({amount: randomInteger(6, 10)})
    } else {
      return Promise.resolve()
    }
  }).then(horses => {
    if (horses) {
      let ownership = []
      horses.forEach(horse => {
        let shares = {
          owned: parseInt(Math.random() * 9) + 1,
          total: parseInt(Math.random() * 15) + 15
        }
        ownership.push({
          horse: horse._id,
          shares
        })
      })
      user.ownership = ownership
      return user.save()
    } else {
      return Promise.resolve()
    }
  }).then(() => {
    return Promise.resolve(verification)
  })
}

const registerUser = body => {
  const {email, firstname} = body

  return createUser(body).then(verification => {
    let baseUrl = global.isDev ? '52.51.111.248:3000' : '54.76.253.247:3000'
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
      }
    }
    if (global.isLocal) {
      mailData.to = `chris@vitaminlondon.com`
    }
    sendMail(mailData)

    return Promise.resolve({message: REGISTER.SUCCESS})
  })
}

module.exports = {
  createUser,
  registerUser
}
