const {prepareQuery, processFiles, success, error} = require('utils/request')
const Message = require('./model')

const availableQueries = ['horseId']

exports.getMessage = (req, res) => {
  let query = prepareQuery(req.query, availableQueries)
  if (query) {
    Message.find(
      prepareQuery(req.query, availableQueries),
      {__v: false, _id: false, horseId: false},
      {
        limit: 20,
        sort: {createdAt: -1}
      }
    ).then(message => {
      res.json(success(message))
    }).catch(err => {
      console.log(err)
      res.error(error(err))
    })
  }
  else {
    res.error(error())
  }
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

exports.createMessage = (req, res) => {
  const {body, files} = req
  const newMessage = new Message(body)

  let errors = newMessage.validateSync()
  if (!errors) {
    const messagePath = `${body.horseId}/${Date.now()}`
    const attachment = processFiles(files, messagePath)
    newMessage.attachment = attachment

    if (attachment.error) {
      res.error(error(attachment.message))
    }
    else if (validateAttachment(newMessage)) {
      newMessage.save(
      ).then(message => {
        console.log(`message received: ${message._id}`)
        res.send(success())
      }).catch(err => {
        console.log('error while saving message')
        console.log(err)
        res.send(error(err))
      })
    }
    else {
      res.send(error())
    }
  }
  else {
    res.send(error())
  }
}