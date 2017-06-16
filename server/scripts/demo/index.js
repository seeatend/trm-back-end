const config = require('config')

require('setup/db')

const userUtils = require('./user')

userUtils.register().then(user => {
  console.log(user)
}).catch(err => {
  console.error(err.message)
})