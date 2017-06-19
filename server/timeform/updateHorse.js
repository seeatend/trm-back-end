const {performances} = require('./api')

const {Horse} = require('api/horse/model')
const syndicateController = require('api/syndicate/controller')
const horseController = require('api/horse/controller')
const {extension} = require('utils/file')
const path = require('path')

const convert = require('./convertFields')

colors = [
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
  '#ffffff',
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


    return syndicateController.updateBrutal(
      horseData.owner.name, {
        color: colors.pop() || getRandomColor(),
        name: additionalData.syndicateName || horseData.owner.name
      }
    )
  }).then(syndicate => {
    syndicateData = syndicate
    horseData.owner._id = syndicate._id
    horseData.owner.color = syndicate.color
    let timeformId = horse.horseCode.trim()
    if (additionalData) {
      additionalData.name = additionalData.name.toUpperCase()
    }
    horseData = Object.assign(horseData, additionalData)
    let multerMockData
    if (additionalData.img) {
      let img = additionalData.img
      let mime = extension(img)
      if (mime === 'jpg') { mime = 'jpeg' }
      multerMockData = {
        fieldname: 'featuredImage',
        originalname: img,
        mimetype: `image/${mime}`,
        filename: img,
        path: path.resolve('./uploads/tmp', img),
      }
    }

    return horseController.updateBrutal(
      {timeformId},
      horseData,
      multerMockData
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
}