const nodemailer = require('nodemailer')
const mailgunTransport = require('nodemailer-mailgun-transport')

const auth = {
  auth: {
    api_key: process.env.MAILGUN_KEY,
    domain: 'mail.theracingmanager.com'
  }
}

const mailgun = nodemailer.createTransport(mailgunTransport(auth))

const sendMail = data => {
  return new Promise((resolve, reject) => {
    mailgun.sendMail(data, (err, info) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(info)
      }
    })
  })
}

module.exports = {
  sendMail
}