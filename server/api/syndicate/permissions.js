const {authenticate} = require('utils/authentication')
const HorseController = require('api/horse/controller')
const SyndicateController = require('api/horse/controller')
const {isString} = require('utils/object')

const ownsSyndicateBySyndicateName = (body, user) => {
  let {syndicateName} = body
  if (isString(syndicateName) && syndicateName.length > 0) {
    return SyndicateController.findOne({name: syndicateName}).select('_id')
      .then(syndicate => {
        if (user.ownsSyndicate(syndicate._id)) return Promise.resolve()
        else return Promise.reject()
      })
  }
  return Promise.reject()
}

const ownsSyndicateByHorseName = (body, user) => {
  let {horseName} = body
  if (horseName) {
    return HorseController.getOwner({horseName})
      .then(syndicate => {
        if (user.ownsSyndicate(syndicate._id)) return Promise.resolve()
        else return Promise.reject()
      })
  }
  return Promise.reject()
}

authenticate.registerPermission('put syndicate', ownsSyndicateBySyndicateName)
authenticate.registerPermission('put horse', ownsSyndicateByHorseName)

module.exports = {
  ownsSyndicateBySyndicateName,
  ownsSyndicateByHorseName
}
