const {hyphenize} = require('utils/request')
const prepareHorse = require('api/horse/prepareHorse')

module.exports = (ownership) => {
  let result = []
  let syndicates = {}
  ownership.forEach(elem => {
    let owner = elem.horse.owner
    let syndicateName = owner.name;
    if (!syndicates[syndicateName]) {
      syndicates[syndicateName] = []
    }
    let newHorse = prepareHorse(elem.horse);
    newHorse.shares = elem.shares
    delete newHorse.owner._id
    syndicates[syndicateName].push(
      newHorse
    )
  })
  Object.keys(syndicates).forEach(key => {
    let value = syndicates[key]
    result.push({
      name: key,
      slug: hyphenize(key),
      horses: value
    })
  })
  return result
}