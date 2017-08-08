const {authenticate} = require('utils/authentication')
const Message = require('api/message/model')
const horsePermissions = require('api/horse/permissions')

const canReadWrite = (body, user) => {
  let {messageId} = body
  if (messageId) {
    return Message.findOne(
      {_id: messageId}
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

authenticate.registerPermission('read', 'message', canReadWrite)
authenticate.registerPermission('write', 'message', canReadWrite)

