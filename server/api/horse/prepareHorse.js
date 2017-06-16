const {hyphenize} = require('utils/request')

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

const prepareHorse = horse => {
  horse.slug = hyphenize(horse.name)
  horse.runs = horse.performances.length
  horse.wins = horse.performances.filter(
    p => {
      if (p.position) {
        return p.position.official === 1
      }
      else {
        return false
      }
    }
  ).length
  horse.places = horse.performances.filter(
    p => {
      if (p.position) {
        return p.position.official === 2 || p.position.official === 3
      }
      else {
        return false
      }
    }
  ).length
  horse.gender = getGender(horse.gender)
  horse.color = getColor(horse.color)
  const removeProps = ['performances', 'timeFormId', '__v']
  removeProps.forEach(prop => {
    delete horse[prop]
  })
  return horse
}

module.exports = prepareHorse