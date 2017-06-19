require('dotenv').config()
require('setup/db')
const {authenticate, horses} = require('./api')

const fs = require('fs-extra')

const updateHorse = require('./updateHorse')
const seedData = require('./seedData')

authenticate.then(() => {
  fs.copy(
    './seed', './uploads/tmp'
  ).then(() => {
    let promises = []
    seedData.forEach(horse => {
      let promise = horses.get({
        $filter: `horseName eq '${horse.name}'`
      })
      promises.push(promise)
    })
    return Promise.all(promises)
  }).then(horses => {
    let promises = []
    horses.forEach((horse, i) => {
      let additionalData = seedData[i]
      promises.push(updateHorse(horse[0], additionalData))
    })
    return Promise.all(promises)
  }).then(() => {
    console.log('Populated timeform data!')
    process.exit(0)
  }).catch(err => {
    console.error(err.message)
    process.exit(err.code)
  })
})
