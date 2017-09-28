const {cloneObject} = require('utils/object')
const {hyphenize} = require('utils/transforms')
const getGender = require('./getGender')
const getColor = require('./getColor')

const prepareHorse = (horse, remove = []) => {
  let newHorse = cloneObject(horse)
  newHorse.slug = hyphenize(newHorse.name)
  if (newHorse.performances) {
    newHorse.runs = newHorse.performances.length
    newHorse.wins = newHorse.performances.filter(
      p => {
        if (p.position) {
          return p.position.official === 1
        } else {
          return false
        }
      }
    ).length
    newHorse.places = newHorse.performances.filter(
      p => {
        if (p.position) {
          return p.position.official === 2 || p.position.official === 3
        } else {
          return false
        }
      }
    ).length
    delete newHorse['performances']
  }
  if (newHorse.gender) {
    newHorse.gender = getGender(newHorse.gender)
  }
  if (newHorse.color) {
    newHorse.color = getColor(newHorse.color)
  }
  if (!newHorse.thumbnailImage) {
    newHorse.thumbnailImage = '/assets/placeholder/thumbnailImage.jpg'
  }
  if (newHorse.owner) {
    newHorse.owner.slug = hyphenize(newHorse.owner.name)
    delete newHorse.owner._id
  }
  remove.forEach(prop => {
    delete newHorse[prop]
  })
  return newHorse
}

module.exports = prepareHorse
