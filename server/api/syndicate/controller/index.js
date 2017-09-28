const {Controller} = require('api/utils')
const SyndicateModel = require('api/syndicate/model')

const SyndicateController = new Controller({
  model: SyndicateModel,
  methods: {
    getSyndicate: require('./getSyndicate'),
    updateByName: require('./updateByName')
  }
})

module.exports = SyndicateController
