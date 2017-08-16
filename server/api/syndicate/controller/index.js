const {Controller} = require('api/utils')
const Syndicate = require('api/syndicate/model')

const SyndicateController = new Controller({
  model: Syndicate,
  methods: {
    getSyndicate: require('./getSyndicate')
  }
})

module.exports = SyndicateController