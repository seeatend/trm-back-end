const Syndicate = require('./model')
const {getMessage} = require('api/message/controller')
const {prepareQuery, dehyphenize} = require('utils/request')

const allowedGetParams = ['name']

const getSyndicate = (body, options = {}) => {
  const {populate = {}} = options
  let query = prepareQuery(
    body,
    allowedGetParams,
    dehyphenize
  )
  return new Promise((resolve, reject) => {
    if (query) {
      let syndicate
      Syndicate.findOne(
        query,
        {__v: false, _id: false}
      ).lean().then(_syndicate => {
        syndicate = _syndicate
        if (syndicate) {
          if (!populate.messages) {
            return Promise.resolve()
          }
          else {
            let promises = []
            syndicate.horses.forEach(horseId => {
              promises.push(getMessage({
                horseId
              }))
            })
            return Promise.all(promises)
          }
        }
        else {
          reject('Not found')
        }
      }).then(messages => {
        if (messages) {
          let messagesData = []
          messages.forEach(m => {
            messagesData = messagesData.concat(m)
          })
          messagesData = messagesData.sort((a, b) => {
            return a.createdAt < b.createdAt
          })
          syndicate.messages = messagesData
        }
        delete syndicate.horses
        resolve(syndicate)
      }).catch(err => {
        reject(err)
      })
    }
    else {
      reject('Wrong query params')
    }
  })
}

const updateSyndicate = (_data = {}) => {
  let data = Object.assign({}, _data)

  data.name = data.owner ? data.name || data.owner.name : data.name

  if (!data.name) {
    return Promise.reject({message: 'Syndicate name is not specified.'})
  }
  else {
    data.name = data.name.toUpperCase()
    let query = {name: data.name}
    return Syndicate.findOne(query)
      .then(syndicate => {
        if (syndicate) {
          if (Object.keys(data).length > 0) {
            return Object.assign(syndicate, data).save()
          }
          else {
            return Promise.resolve(syndicate)
          }
        }
        else {
          return Syndicate.create(data)
        }
      }).then(syndicate => {
        if (syndicate) {
          return Promise.resolve(syndicate)
        }
        else {
          return Promise.reject({message: 'Could not create syndicate.'})
        }
      })
  }
}

module.exports = {
  updateSyndicate,
  getSyndicate
}