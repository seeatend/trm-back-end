const {Horse} = require('./model')
const Message = require('api/message/model')
const {prepareQuery, dehyphenize, success, error} = require('utils/request')

const availableQueries = ['name']

const prepareHorse = horse => {
  horse.runs = horse.performances.length
  horse.wins = horse.performances.filter(
    p => p.position.official === 1
  ).length
  const removeProps = ['performances', 'timeFormId']
  removeProps.forEach(prop => {
    delete horse[prop]
  })
  return horse
}

exports.getHorse = (req, res) => {
  let query = prepareQuery(req.query, availableQueries)
  if (query) {
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
    res.error(error())
  }
}