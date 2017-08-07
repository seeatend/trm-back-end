const {authenticate} = require('utils/authentication')

const canReadWrite = (body, user) => {
  let {horseId} = body
  let matches = user.ownership.filter(e => (e.horse.toString() === horseId.toString()))
  if (horseId && matches.length > 0) {
    return Promise.resolve()
  }
  else {
    return Promise.reject()
  }
}

authenticate.registerPermission('write', 'horse', canReadWrite)
authenticate.registerPermission('read', 'horse', canReadWrite)

module.exports = {
  write: canReadWrite,
  read: canReadWrite
}

