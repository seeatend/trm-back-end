const Syndicate = require('./model')
const {getMessage} = require('api/message/controller')
const {prepareQuery, dehyphenize} = require('utils/request')

const allowedGetParams = ['name']

const getSyndicate = (query) => {
  let searchQuery = prepareQuery(
    query,
    allowedGetParams,
    (key, value) => dehyphenize(value)
  )
  return new Promise((resolve, reject) => {
    if (searchQuery) {
      let syndicate
      Syndicate.findOne(
        searchQuery,
        {__v: false, _id: false, owner: false}
      ).lean().then(_syndicate => {
        syndicate = _syndicate
        if (syndicate) {
          let promises = []
          syndicate.horses.forEach(horseId => {
            promises.push(getMessage({
              horseId
            }))
          })
          return Promise.all(promises)
        }
        else {
          reject('Not found')
        }
      }).then(messages => {
        let messagesData = []
        messages.forEach(m => {
          messagesData = messagesData.concat(m)
        })
        messagesData = messagesData.sort((a, b) => {
          return a.createdAt < b.createdAt
        })
        syndicate.messages = messagesData
        delete syndicate.horses
        resolve(syndicate)
      }).catch(err => {
        resolve(err.message)
      })
    }
    else {
      reject('Wrong query params')
    }
  })
}

const updateSyndicate = (owner, data = {}) => {
  return new Promise((resolve, reject) => {
    if (owner) {
      Syndicate.findOne(
        {owner}
      ).then(syndicate => {
        if (syndicate) {
          if (Object.keys(data).length > 0) {
            return Object.assign(syndicate, data).save()
          }
          else {
            resolve(syndicate)
          }
        }
        else {
          return Syndicate.create(Object.assign({owner}, data))
        }
      }).then(syndicate => {
        if (syndicate) {
          resolve(syndicate)
        }
        else {
          reject({message: 'Could not create syndicate.'})
        }
      }).catch(err => {
        reject(err)
      })
    }
    else {
      reject({message: 'Syndicate owner is not specified.'})
    }
  })
}

module.exports = {
  updateSyndicate,
  getSyndicate
}