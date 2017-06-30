const {horseHelper} = require('api/horse/model')
const getHorse = require('./getHorse')

module.exports = (body = {}) => {
  if (body.query) {
    body.query = body.query.toUpperCase()
  }
  return horseHelper.search(
    body
  ).then(results => {
    let promises = []
    results.hits.forEach(hit => {
      promises.push(getHorse(
        {_id: hit.objectID},
        {shares: true}
      ))
    })
    return Promise.all(promises)
  }).then(horses => {

    let result = {
      results: []
    }
    horses.forEach(horse => {
      result.results.push({
        name: horse.name,
        age: horse.age,
        sharesAvailable: 1 - horse.shares.owned / horse.shares.total,
        monthlyCost: horse.cost.monthly
      })
    })
    return Promise.resolve(result)
  })
}