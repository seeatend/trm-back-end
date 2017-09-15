const Syndicate = require('api/syndicate/model')
const {getMessage} = require('api/message/controller')
const {prepareQuery} = require('utils/request')

const allowedGetParams = ['name']

const getSyndicate = (body, options = {}) => {
  const {populate = {}} = options
  let query = prepareQuery(
    body,
    allowedGetParams
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
          } else {
            let promises = []
            syndicate.horses.forEach(horseId => {
              promises.push(getMessage({
                horseId
              }))
            })
            return Promise.all(promises)
          }
        } else {
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
    } else {
      reject('Wrong query params')
    }
  })
}

module.exports = getSyndicate
