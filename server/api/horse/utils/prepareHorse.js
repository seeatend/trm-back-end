const {hyphenize} = require('utils/request')
const {cloneObject} = require('utils/object')
const getGender = require('./getGender')
const getColor = require('./getColor')

const prepareHorse = (horse, remove = []) => {
  let newHorse = cloneObject(horse)
  newHorse.slug = hyphenize(newHorse.name)
  newHorse.runs = newHorse.performances.length
  newHorse.wins = newHorse.performances.filter(
    p => {
      if (p.position) {
        return p.position.official === 1
      }
      else {
        return false
      }
    }
  ).length
  newHorse.places = newHorse.performances.filter(
    p => {
      if (p.position) {
        return p.position.official === 2 || p.position.official === 3
      }
      else {
        return false
      }
    }
  ).length
  if (newHorse.gender) {
    newHorse.gender = getGender(newHorse.gender)
  }
  if (newHorse.color) {
    newHorse.color = getColor(newHorse.color)
  }
  if (!newHorse.thumbnailImage) {
    newHorse.thumbnailImage = '/assets/placeholder/thumbnailImage.jpg'
  }
  newHorse.owner.slug = hyphenize(newHorse.owner.name)
  delete newHorse.owner._id
  delete newHorse.owner.color
  const removeProps = remove.concat(['performances'])
  removeProps.forEach(prop => {
    delete newHorse[prop]
  })
  return newHorse
}

module.exports = prepareHorse