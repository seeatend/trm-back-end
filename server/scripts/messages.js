require('dotenv').config()
require('setup/db')

let fs = require('fs-extra')

let {Horse} = require('api/horse/model')
let {createMessage} = require('api/message/controller')
const {mockFileUpload} = require('utils/mock')

const messages = require('./messageData')

const _createMessage = (horseName, _data) => {
  let data = Object.assign({}, _data)
  let files = []
  if (data.attachment) {
    if (Array.isArray(data.attachment)) {
      data.attachment.forEach(att => {
        files.push(mockFileUpload(
          'attachment',
          `messages/${att}`
        ))
      })
    }
    else {
      files.push(mockFileUpload(
        'attachment',
        `messages/${data.attachment}`
      ))
    }
  }
  console.log(`Creating message for ${horseName}`)
  // console.log(files)
  return Horse.findOne(
    {name: horseName.toUpperCase()},
    {_id: true}
  ).then(horse => {
    data.horseId = horse._id
    return createMessage(data, files)
  })
}

fs.copy(
  './seed/messages', './uploads/tmp/messages'
).then(() => {
  let promises = []

  messages.forEach(messageData => {
    messageData.messages.forEach(message => {
      promises.push(_createMessage(messageData.horseName, message))
    })
  })
  return Promise.all(promises)
}).then(() => {
  console.log('Messages created')
  process.exit(0)
}).catch(err => {
  console.log(err)
  process.exit(0)
})