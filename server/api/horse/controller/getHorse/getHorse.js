const {Horse} = require('api/horse/model')
const {prepareQuery, dehyphenize} = require('utils/request')
const {prepareHorse} = require('api/horse/utils')
const {getSyndicate} = require('api/syndicate/controller')
const {GENERIC} = require('data/messages')
const availableQueries = ['name', '_id']

module.exports = body => {
  let query = prepareQuery(body, availableQueries, dehyphenize)

  if (query) {
    let horse
    return Horse.findOne(
      query,
      {__v: false, timeformId: false}
    ).lean().then(_horse => {
      horse = _horse
      if (horse) {
        let horseData = prepareHorse(horse)

        return Promise.resolve(horseData)
      }
      else {
        return Promise.reject({message: GENERIC.NOT_FOUND})
      }
    }).then(horse => {
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
  }
  else {
    return Promise.reject()
  }
}