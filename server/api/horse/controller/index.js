const {Controller} = require('api/utils')
const {HorseModel} = require('api/horse/model')

const HorseController = new Controller({
  model: HorseModel,
  methods: {
    getHorse: require('./getHorse'),
    getRandomHorse: require('./getRandomHorse'),
    removeHorse: require('./removeHorse'),
    searchHorse: require('./searchHorse'),
    updateByName: require('./updateByName'),
    getOwner: require('./getOwner')
  }
})

module.exports = HorseController
