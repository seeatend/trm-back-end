const {Horse} = require('./model')
const User = require('api/user/model')
const Message = require('api/message/model')
const {prepareQuery, dehyphenize, success, error, processFiles} = require('utils/request')
const prepareHorse = require('./prepareHorse')

const availableQueries = ['name']

const getHorse = (req, res) => {
  let query = prepareQuery(req.query, availableQueries)
  if (query && Object.keys(query).length === 1) {
    query.name = dehyphenize(query.name)
    let horseData
    Horse.findOne(
      query,
      {
        __v: false,
        timeformId: false,
      }
    ).then(horse => {
      if (horse) {
        horseData = prepareHorse(horse.toObject())

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
      res.send(success(horseData))
    }).catch(err => {
      console.error(err)
      res.status(404).send(error(err.message))
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
      res.status(404).json(error())
    })
  }
}

const updateHorse = (query, data, files) => {
  data = Object.assign({}, data)
  if (files) {
    const filesData = processFiles(files, `horses/${Date.now()}`)
    console.log(filesData)
    if (filesData) {
      if (filesData.featuredImage && filesData.featuredImage.length > 0) {
        data.featuredImage = filesData.featuredImage[0].path
      }
      if (filesData.thumbnailImage && filesData.thumbnailImage.length > 0) {
        data.thumbnailImage = filesData.thumbnailImage[0].path
      }
    }
  }

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

module.exports = {
  getHorse,
  updateHorse
}