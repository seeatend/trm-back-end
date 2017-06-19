require('dotenv').config()
require('setup/db')
const {authenticate, horses} = require('./api')

const fs = require('fs-extra')

const {Horse} = require('api/horse/model')
const User = require('api/user/model')
const Message = require('api/message/model')
const Syndicate = require('api/syndicate/model')
const updateHorse = require('./updateHorse')
const seedData = require('./seedData')

authenticate.then(() => {
  Promise.all([
    Horse.remove({}),
    User.remove({}),
    Message.remove({}),
    Syndicate.remove({})
  ]).then(() => {
    return fs.copy('./seed', './uploads/tmp')
  }).then(() => {
    let promises = []
    seedData.forEach(horse => {
      let promise = horses.get({
        $filter: `horseName eq '${horse.name}'`
      })
      promises.push(promise)
    })
    return Promise.all(promises)
  }).then(horses => {
    horses.forEach((horse, i) => {
      let additionalData = seedData[i]
      updateHorse(horse[0], additionalData)
    })
  }).catch(err => {
    console.error(err.message)
  })
})
