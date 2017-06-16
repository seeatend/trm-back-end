const {Horse} = require('./model')
const Message = require('api/message/model')
const {prepareQuery, dehyphenize, success, error} = require('utils/request')
const prepareHorse = require('./prepareHorse')

const availableQueries = ['name']

exports.getHorse = (req, res) => {
  let query = prepareQuery(req.query, availableQueries)
  if (query && Object.keys(query).length === 1) {
    query.name = dehyphenize(query.name)
    Horse.findOne(
      query,
      {
        __v: false,
        timeformId: false,
      }
    ).then(horse => {
      if (horse) {
        this.horse = prepareHorse(horse.toObject())

        return Message.find(
          {horseId: horse._id},
          {_id: false, __v: false, horseId: false},
          {
            limit: 20,
            sort: {createdAt: -1}
          }
        )
      }
      else {
        throw new Error('Not found')
      }
    }).catch(err => {
      res.send(error(err.message))
    }).then(messages => {
      if (this.horse) {
        this.horse.messages = messages
        res.send(success(this.horse))
      }
    }).catch(err => {
      res.send(error(err.message))
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

exports.updateBrutal = (query, data) => {
  return new Promise((resolve, reject) => {
    Horse.findOneAndUpdate(
      query,
      data,
      {upsert: true, new: true}
    ).then(horse => {
      if (horse) {
        resolve(horse)
      }
      else {
        reject({message: 'Could not update horse.'})
      }
    }).catch(err => {
      reject(err)
    })
  })
}