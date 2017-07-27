require('setup/db').createDBConnection()

const fs = require('fs-extra')

const {Horse} = require('api/horse/model')
const User = require('api/user/model')
const Message = require('api/message/model')
const Syndicate = require('api/syndicate/model')

Promise.all([
  Horse.remove({}),
  User.remove({}),
  Message.remove({}),
  Syndicate.remove({}),
  fs.remove('./uploads')
]).then(() => {
  console.log('Flushed')
  process.exit(0)
}).catch(err => {
  console.log(err.message)
})