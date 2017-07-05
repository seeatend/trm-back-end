const {Horse} = require('api/horse/model')
const {prepareQuery, dehyphenize} = require('utils/request')
const {prepareHorse} = require('api/horse/utils')

const availableQueries = ['name', '_id']

module.exports = body => {
  let query = prepareQuery(body, availableQueries, dehyphenize)

  if (query) {
    return Horse.findOne(
      query,
      {__v: false, timeformId: false}
    ).lean().then(horse => {
      if (horse) {
        let horseData = prepareHorse(horse)

        return Promise.resolve(horseData)
      }
      else {
        return Promise.reject({message: 'Not found'})
      }
    })
  }
  else {
    return Promise.reject()
  }
}