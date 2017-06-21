const Syndicate = require('./model')
const {getMessage} = require('api/message/controller')
const {prepareQuery, dehyphenize, processFiles} = require('utils/request')

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
        {__v: false, _id: false}
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
        reject(err)
      })
    }
    else {
      reject('Wrong query params')
    }
  })
}

const updateSyndicate = (data = {}, files) => {
  data = Object.assign({}, data)

  return new Promise((resolve, reject) => {
    processFiles(
      files, `syndicates/${Date.now()}`
    ).then(filesInfo => {
      if (filesInfo) {
        if (filesInfo.featuredImage && filesInfo.featuredImage.length > 0) {
          data.featuredImage = filesInfo.featuredImage[0].path
        }
        if (filesInfo.logo && filesInfo.logo.length > 0) {
          data.logo = filesInfo.logo[0].path
        }
      }
      data.name = data.owner ? data.name || data.owner.name : data.name

      if (data.name) {
        data.name = data.name.toUpperCase()
        let query = {name: data.name}
        return Syndicate.findOne(query)
      }
      else {
        reject({message: 'Syndicate owner is not specified.'})
      }
    }).then(syndicate => {
      if (syndicate) {
        if (Object.keys(data).length > 0) {
          return Object.assign(syndicate, data).save()
        }
        else {
          resolve(syndicate)
        }
      }
      else {
        return Syndicate.create(data)
      }
    }).then(syndicate => {
      if (syndicate) {
        resolve(syndicate)
      }
      else {
        reject({message: 'Could not create syndicate.'})
      }
    }).catch(reject)
  })
}

module.exports = {
  updateSyndicate,
  getSyndicate
}