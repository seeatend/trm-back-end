const {horseIndex} = require('api/horse/model')
const getHorse = require('./getHorse')

module.exports = (body = {}) => {
  if (body.query) {
    body.query = body.query.toUpperCase()
  }
  return horseIndex.search(
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
      results: horses
    }
    return Promise.resolve(result)
  })
}