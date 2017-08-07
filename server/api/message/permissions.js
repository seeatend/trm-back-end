const {authenticate} = require('utils/authentication')
const Message = require('api/message/model')
const horsePermissions = require('api/horse/permissions')

const canWrite = (body, user) => {
  let {messageId} = body
  if (messageId) {
    return Message.findOne(
      {_id: messageId},
      {horseId: true}
    ).then(message => {
      if (message && message.horseId) {
        return horsePermissions.write(
          {horseId: message.horseId},
          user
        )
      }
      else {
        return Promise.reject()
      }
    })
  }
  else {
    return Promise.reject()
  }
}

authenticate.registerPermission('write', 'message', canWrite)

