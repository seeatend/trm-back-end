const nodemailer = require('nodemailer')
const mailgunTransport = require('nodemailer-mailgun-transport')

const auth = {
  auth: {
    api_key: process.env.MAILGUN_KEY,
    domain: 'sandboxcbafbb604f804633b1bc11a8d04a6dc1.mailgun.org'
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