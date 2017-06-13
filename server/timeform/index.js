const fs = require('fs-extra')
process.env.NODE_ENV = 'test'
require('dotenv').config()
const {authenticate, horses, performances} = require('./api')
require('setup/db')
const mongoose = require('mongoose')
require('api/horse/model')
const Horse = mongoose.model('Horse')


const convert = require('./convertFields')

authenticate.then(() => {
  horses.get({
    $top: 2,
  }).then(horses => {
    horses.forEach(horse => {
      console.log(`Processing: ${horse.horseName}`)

      performances.get({
        $filter: `horseCode eq '${horse.horseCode}'`
      }).then(performances => {
        console.log(`Performances for: ${horse.horseName}`)

        const horseData = convert.horse(horse)

        let performancesData = []
        performances.forEach(performance => {
          performancesData.push(convert.performance(performance))
        })

        horseData.performances = performancesData

        return Horse.findOneAndUpdate(
          {timeFormId: horse.horseCode},
          horseData,
          {upsert: true}
        )
      }).then(res => {
        console.log(`Saved: ${horse.horseName}`)
      }).catch(err => {
        console.error(err)
      })
    })
  })
})
