const {Controller} = require('api/utils')
const {Horse} = require('api/horse/model')

const HorseController = new Controller({
  model: Horse,
  methods: {
    getHorse: require('./getHorse'),
    getRandomHorse: require('./getRandomHorse'),
    removeHorse: require('./removeHorse'),
    searchHorse: require('./searchHorse'),
    updateOrCreateHorse: require('./updateOrCreateHorse')
  }
})

module.exports = HorseController