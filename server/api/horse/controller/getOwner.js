const SyndicateController = require('api/syndicate/controller')

module.exports = function ({horseName}) {
  return this.findOne({name: horseName.toUpperCase()}).select('_id')
    .then(horse => {
      if (!horse) return Promise.reject()
      return SyndicateController.findOne({
        horses: horse._id
      })
    })
}
