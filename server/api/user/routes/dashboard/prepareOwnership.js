const {hyphenize} = require('utils/transforms')
const {prepareHorse} = require('api/horse/utils')

module.exports = (ownership) => {
  let result = []
  let syndicates = {}
  ownership.forEach(elem => {
    let owner = elem.horse.owner
    let syndicateName = owner.name
    if (!syndicates[syndicateName]) {
      syndicates[syndicateName] = {
        horses: []
      }
    }
    let newHorse = prepareHorse(elem.horse)
    newHorse.shares = elem.shares
    syndicates[syndicateName].color = elem.horse.owner.color
    syndicates[syndicateName].horses.push(
      newHorse
    )
  })
  Object.keys(syndicates).forEach(key => {
    let value = syndicates[key]
    result.push({
      name: key,
      slug: hyphenize(key),
      color: value.color,
      horses: value.horses
    })
  })
  return result
}
