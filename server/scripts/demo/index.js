const config = require('config')

require('setup/db')

const userUtils = require('./user')

userUtils.register().then(user => {
  console.log(user)
  process.exit(0)
}).catch(err => {
  console.error(err.message)
  process.exit(err.code)
})