require('dotenv').config()
require('setup/db')

let fs = require('fs-extra')

let {Horse} = require('api/horse/model')
let User = require('api/user/model')
let Message = require('api/message/model')
let Syndicate = require('api/syndicate/model')

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