const {prepareQuery, processFiles, success, error} = require('utils/request')
const Message = require('./model')

const availableQueries = ['horseId']

const getMessage = (query) => {
  query = prepareQuery(query, availableQueries) || {}
  return Message.find(
    query,
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

const createMessage = (req, res) => {
  const {body, files} = req
  const newMessage = new Message(body)

  let errors = newMessage.validateSync()
  if (!errors) {
    const messagePath = `messages/${body.horseId}/${Date.now()}`
    processFiles(
      files, messagePath
    ).then(filesInfo => {

      newMessage.attachment = filesInfo.attachment

      if (filesInfo.error) {
        res.error(error(filesInfo.message))
      }
      else if (validateAttachment(newMessage)) {
        newMessage.save(
        ).then(message => {
          console.log(`message received: ${message._id}`)
          res.send(success())
        }).catch(err => {
          console.log('error while saving message')
          console.log(err)
          res.status(404).send(error(err))
        })
      }
      else {
        res.status(404).send(error())
      }
    }).catch(err => {
      console.log(err.message)
      res.status(404).send(error())
    })
  }
  else {
    res.status(404).send(error())
  }
}

module.exports = {
  getMessage,
  createMessage
}