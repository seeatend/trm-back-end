require('setup/db').createDBConnection()

const fs = require('fs-extra')

const HorseController = require('api/horse/controller')
const User = require('api/user/model')
const Message = require('api/message/model')
const SyndicateController = require('api/syndicate/controller')

Promise.all([
  HorseController.removeAll(),
  User.remove({}),
  Message.remove({}),
  SyndicateController.removeAll(),
  fs.remove('./uploads')
]).then(() => {
  console.log('Flushed')
  process.exit(0)
}).catch(err => {
  console.log(err.message)
})
