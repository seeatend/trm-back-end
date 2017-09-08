const loadTemplate = require('./loadTemplate')
const templates = {
  verification: loadTemplate('verification')
}

const nodemailer = require('nodemailer')
const mailgunTransport = require('nodemailer-mailgun-transport')

const auth = {
  auth: {
    api_key: process.env.MAILGUN_KEY,
    domain: 'mail.theracingmanager.com'
  }
}

const mailgun = nodemailer.createTransport(mailgunTransport(auth))

const sendMail = _data => {
  if (global.isTest) {
    return Promise.resolve()
  }
  let data = Object.assign({}, _data)
  if (data.template) {
    let template = templates[data.template.name]
    data.html = template(data.template.data)
    delete data.template
  }
  return new Promise((resolve, reject) => {
    mailgun.sendMail(data, (err, info) => {
      if (err) {
        reject(err)
      } else {
        resolve(info)
      }
    })
  })
}

module.exports = {
  sendMail
}
