const {horseIndex} = require('api/horse/model')
const getHorse = require('./getHorse')

module.exports = (body) => {
  if (body.name && body.name.length > 0) {
    let name = body.name.toUpperCase()
    return horseIndex.search(
      name
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
  else {
    return Promise.reject()
  }
}