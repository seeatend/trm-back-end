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
      if (_horse) {
        horse = prepareHorse(_horse)

        return Promise.resolve()
      }
      else {
        return Promise.reject({message: GENERIC.NOT_FOUND})
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
  }
  else {
    return Promise.reject()
  }
}