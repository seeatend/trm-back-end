const {Horse} = require('./model')
const {prepareQuery, dehyphenize, success, error} = require('utils/request')

const availableQueries = ['name']

const prepareHorse = horse => {
  horse.runs = horse.performances.length
  horse.wins = horse.performances.filter(
    p => { return p.position.official === 1}
  ).length
  const removeProps = ['performances', 'timeFormId']
  removeProps.forEach(prop => {
    delete horse[prop]
  })
  return horse
}

exports.getHorse = function (req, res) {
  let query = prepareQuery(req.query, availableQueries)
  if (query) {
    query.name = dehyphenize(query.name)
    Horse.findOne(
      query,
      {__v: false, _id: false}
    ).then(horse => {
      res.json(success(prepareHorse(horse.toObject())))
    }).catch(err => {
      res.send(error(err))
    })
  }
}