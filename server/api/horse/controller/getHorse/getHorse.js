const {HorseModel} = require('api/horse/model')
const {prepareQuery} = require('utils/request')
const {prepareHorse} = require('api/horse/utils')
const {getSyndicate} = require('api/syndicate/controller')
const {METHODS} = require('data/messages')
const availableQueries = ['name', '_id']

module.exports = body => {
  let query = prepareQuery(body, availableQueries)

  if (query) {
    let horse
    return HorseModel.findOne(
      query,
      {__v: false, timeformId: false}
    ).lean().then(_horse => {
      if (_horse) {
        horse = prepareHorse(_horse)

        return Promise.resolve()
      } else {
        return Promise.reject(new Error(METHODS.HORSE.NOT_FOUND(query.name || query._id)))
      }
    }).then(() => {
      if (!horse.owner) {
        return Promise.resolve()
      }
      return getSyndicate({
        name: horse.owner.name
      })
    }).then(syndicate => {
      if (syndicate) {
        horse.owner.color = syndicate.color
      }
      return Promise.resolve(horse)
    })
  } else {
    return Promise.reject()
  }
}
