const {prepareQuery, processFiles, success, error} = require('utils/request')
const Message = require('./model')

const availableQueries = ['horseId']

const getMessage = (query) => {
  let _query = prepareQuery(query, availableQueries)
  return Message.find(
    _query,
    {__v: false, _id: false, horseId: false},
    {
      limit: 20,
      sort: {createdAt: -1}
    }
  )
}

const validateAttachment = (body) => {
  let validated = false
  const requiredProps = ['attachment', 'text']
  requiredProps.forEach((propName) => {
    if (body[propName] && body[propName].length > 0) {
      validated = true
    }
  })
  return validated
}

const createMessage = (body, files) => {
  const newMessage = new Message(body)

  let errors = newMessage.validateSync()
  return new Promise((resolve, reject) => {
    if (!errors) {
      const messagePath = `messages/${body.horseId}/${Date.now()}`
      processFiles(
        files, messagePath
      ).then(filesInfo => {

        if (filesInfo) {
          newMessage.attachment = filesInfo.attachment
        }

        if (validateAttachment(newMessage)) {
          newMessage.save(
          ).then(message => {
            console.log(`message received: ${message._id}`)
            resolve()
          }).catch(err => {
            console.log('error while saving message')
            console.log(err)
            reject(err)
          })
        }
        else {
          reject()
        }
      }).catch(err => {
        console.log(err.message)
        reject(err)
      })
    }
    else {
      reject(err)
    }
  })
}

module.exports = {
  getMessage,
  createMessage
}