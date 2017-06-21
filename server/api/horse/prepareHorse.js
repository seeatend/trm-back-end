const {hyphenize} = require('utils/request')
const {cloneObject} = require('utils/object')

const colors = {
  'b': 'bay',
  'br': 'brown',
  'ch': 'chestnut',
  'gr': 'grey',
  'b  or br': 'bay or brown',
  'b or br': 'bay or brown',
  'ro': 'roan',
  'bl': 'black',
  'gr or ro': 'grey or roan',
  'ro or gr': 'roan or grey',
  'b  or ro': 'brown or roan',
  'ch or br': 'chestnut or brown',
  'bl or br': 'black or brown',
}

const getColor = color => colors[color.trim()] || 'unknown'

const genders = {
  f: 'filly',
  c: 'colt',
  g: 'gelding',
  h: 'horse',
  m: 'mare',
  r: 'rig'
}

const getGender = gender => genders[gender.trim()] || 'unknown'

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