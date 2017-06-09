const request = require('request-promise')

const apiBaseUrl = 'https://api.timeform.com/HorseRacingApi/odata/'

const apiNames = [
  'races',
  'jockeys',
  'entries',
  'countries',
  'trainers',
  'courses',
  'meetings',
  'horses',
  'performances'
]

let token

const authenticate = new Promise((resolve, reject) => {
  require('./login').then(body => {
    body = JSON.parse(body)
    token = body.access_token
    resolve()
  }).catch(() => {
    reject()
  })
})

apiNames.forEach(name => {
  let urlSuffix = name[0].toUpperCase() + name.slice(1)
  exports[name] = {
    get: (query) => {
      return new Promise((resolve, reject) => {
        request.get({
          url: `${apiBaseUrl}/${urlSuffix}`,
          qs: query,
          auth: {
            'bearer': token
          }
        }).then(body => {
          body = JSON.parse(body)
          resolve(body.value)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
})

exports.authenticate = authenticate