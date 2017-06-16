const fs = require('fs-extra')
require('dotenv').config()
const {authenticate, horses, performances} = require('./api')
require('setup/db')

const {Horse} = require('api/horse/model')
const Syndicate = require('api/syndicate/model')
const syndicateController = require('api/syndicate/controller')
const horseController = require('api/horse/controller')

const convert = require('./convertFields')

authenticate.then(() => {
  horses.get({
    $top: 20,
  }).then(horses => {
    horses.forEach((horse) => {
      console.log(`Processing: ${horse.horseName}`)
      let horseData, syndicateData

      performances.get({
        $filter: `horseCode eq '${horse.horseCode}'`
      }).then(performances => {
        console.log(`Performances for: ${horse.horseName}`)

        horseData = convert.horse(horse)

        let performancesData = []
        performances.forEach(performance => {
          performancesData.push(convert.performance(performance))
        })

        horseData.performances = performancesData

        if (!horseData.owner || !horseData.owner.name) {
          throw new Error(`Horse owner is undefined(${horseData.name})`)
        }

        return syndicateController.findBrutal(horseData.owner.name)
      }).then(syndicate => {
        syndicateData = syndicate
        horseData.owner._id = syndicate._id
        let timeFormId = horse.horseCode.trim()

        return horseController.updateBrutal(
          {timeFormId: timeFormId},
          horseData
        )
      }).then(savedHorse => {
        console.log(`Saved: ${horse.horseName}`)

        if (savedHorse._id && syndicateData.horses.indexOf(savedHorse._id) < 0) {
          syndicateData.horses.push(savedHorse._id)
          return syndicateData.save().then(res => {
            console.log('Horse added to syndicate')
          }).catch(err => {
            console.error(err.message)
          })
        }
        else {
          console.log('Horse already part of syndicate')
        }
      }).catch(err => {
        console.error(err.message)
      })
    })
  }).catch(err => {
    console.error(err.message)

  })
})
