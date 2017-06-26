const {Horse} = require('api/horse/model')
const User = require('api/user/model')
const Message = require('api/message/model')
const {prepareQuery, dehyphenize} = require('utils/request')
const {prepareHorse} = require('api/horse/utils')

const availableQueries = ['name']

module.exports = getHorse = (body) => {
  let query = prepareQuery(body, availableQueries, dehyphenize)

  if (query) {
    let horseData
    return Horse.findOne(
      query,
      {__v: false, timeformId: false}
    ).then(horse => {
      if (horse) {
        horseData = prepareHorse(horse.toObject())

        return Message.find(
          {horseId: horse._id},
          {__v: false, horseId: false},
          {
            limit: 20,
            sort: {createdAt: -1}
          }
        )
      }
      else {
        return Promise.reject({message: 'Not found'})
      }
    }).then(messages => {
      horseData.messages = messages
      return User.findOne(
        {name: 'demo'},
        {ownership: true}
      )
    }).then(user => {
      if (user && user.ownership) {
        let ownership = user.ownership.filter(elem => {
          return elem.horse.toString() === horseData._id.toString()
        })
        if (ownership.length > 0 && ownership[0]) {
          horseData.shares = ownership[0].shares
        }
      }
      return Promise.resolve(horseData)
    }).catch(Promise.reject)
  }
  else {
    return Horse.find(
      {}, {__v: false},
      {lean: true}
    ).then(horses => {
      const results = []
      horses.forEach(horse => {
        results.push(prepareHorse(horse))
      })
      return Promise.resolve(results)
    }).catch(Promise.reject)
  }
}
