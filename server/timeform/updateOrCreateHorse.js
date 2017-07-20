const {performances} = require('./api')

const {Horse} = require('api/horse/model')
const {updateSyndicate} = require('api/syndicate/controller')
const {updateOrCreateHorse} = require('api/horse/controller')
const {mockFileUpload} = require('utils/mock')
const {randomInteger} = require('utils/math')

const convert = require('./convertFields')

const colors = [
  '#FFF2C7',
  '#12242f',
  '#794440',
  '#004890',
  '#006351',
  '#1fb259',
  '#959ca1',
  '#a0cced',
  '#6db43e',
  '#b30337',
  '#b3a1cd',
  '#f78e1e',
  '#fac8ca',
  '#542989',
  '#ee2e23',
  '#0068b3',
  '#e7e7e7',
  '#fff352'
]

const getRandomColor = () => {
  let letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

module.exports = (horse, additionalData = {}) => {
  if (horse) {
    console.log(`Processing: ${horse.horseName}`)
    let horseData, syndicateData

    return new Promise((resolve, reject) => {
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
        horseData = Object.assign(horseData, additionalData)
        horseData.name = horseData.name.toUpperCase()

        if (!horseData.owner || !horseData.owner.name) {
          reject(`Horse owner is undefined(${horseData.name})`)
        }

        let syndicateFiles = []
        let syndicateData = {}
        if (horseData.syndicate) {
          horseData.owner.name = horseData.syndicate.name || horseData.owner.name
          syndicateData = horseData.syndicate
          if (syndicateData.featuredImage) {
            syndicateFiles.push(mockFileUpload(
              'featuredImage', syndicateData.featuredImage
            ))
          }
          if (syndicateData.logo) {
            syndicateFiles.push(mockFileUpload(
              'logo', syndicateData.logo
            ))
          }
        }
        horseData.owner.name = horseData.owner.name.toUpperCase()

        return updateSyndicate(
          Object.assign(
            {
              color: colors.pop() || getRandomColor(),
              owner: horseData.owner
            },
            syndicateData
          ),
          syndicateFiles
        )
      }).then(syndicate => {
        console.log('Updated syndicate')
        syndicateData = syndicate
        horseData.owner._id = syndicate._id
        horseData.owner.color = syndicate.color
        horseData.racingType = Math.random() > .6 ? 'National Hunt' : Math.random() > .3 ? 'Flat Racing' : 'Dual Purpose'
        horseData.ownership = {
          type: Math.random() > .5 ? 'Fixed Period' : 'Open Ended Period'
        }
        if (horseData.ownership.type === 'Open Ended Period') {
          horseData.ownership.years = randomInteger(1, 6)
        }
        horseData.cost = {
          monthly: randomInteger(500, 1500) * 5,
          initial: randomInteger(2100, 4500) * 5
        }
        horseData.shares = {
          owned: parseInt(Math.random() * 9) + 1,
          total: parseInt(Math.random() * 15) + 15
        }
        let timeformId = horse.horseCode.trim()
        let horseFiles = []
        if (additionalData.img) {
          horseFiles.push(mockFileUpload(
            'featuredImage', additionalData.img
          ))
        }
        if (additionalData.thumbnail) {
          horseFiles.push(mockFileUpload(
            'thumbnailImage', additionalData.thumbnail
          ))
        }

        return updateOrCreateHorse(
          {timeformId},
          horseData,
          horseFiles
        )
      }).then(savedHorse => {
        console.log(`Saved: ${horse.horseName}`)

        if (savedHorse._id && syndicateData.horses.indexOf(savedHorse._id) < 0) {
          syndicateData.horses.push(savedHorse._id)
          return syndicateData.save().then(res => {
            console.log('Horse added to syndicate')
            resolve()
          }).catch(err => {
            reject(err)
          })
        }
        else {
          console.log('Horse already part of syndicate')
          resolve()
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
}