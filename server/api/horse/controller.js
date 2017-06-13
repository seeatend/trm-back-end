const {Horse} = require('./model')
const Message = require('api/message/model')
const {prepareQuery, dehyphenize, success, error} = require('utils/request')

const availableQueries = ['name']

const prepareHorse = horse => {
  horse.runs = horse.performances.length
  horse.wins = horse.performances.filter(
    p => {
      if (p.position) {
        return p.position.official === 1
      }
      else { return false }
    }
  ).length
  const removeProps = ['performances', 'timeFormId']
  removeProps.forEach(prop => {
    delete horse[prop]
  })
  return horse
}

exports.getHorse = (req, res) => {
  let query = prepareQuery(req.query, availableQueries)
  if (query && Object.keys(query).length === 1) {
    query.name = dehyphenize(query.name)
    Horse.findOne(
      query,
      {__v: false}
    ).then(horse => {
      this.horse = prepareHorse(horse.toObject())
      return Message.find(
        {horseId: horse._id},
        {_id: false, __v: false, horseId: false},
        {
          limit: 20,
          sort: {createdAt: -1}
        }
      )
    }).catch(err => {
      console.log(err)
      res.send(error(err))
    }).then(messages => {
      this.horse.messages = messages
      res.send(success(this.horse))
    }).catch(err => {
      console.log(err)
      res.send(error(err))
    })
  }
  else {
    Horse.find(
      {}, {__v: false},
      {lean: true}
    ).then(horses => {
      const result = []
      horses.forEach(horse => {
        result.push(prepareHorse(horse))
      })
      res.json(success(result))
    }).catch(err => {
      console.log(err)
      res.error(error())
    })
  }
}