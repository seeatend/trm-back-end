const mongoose = require('mongoose')
const config = require('config')

const { host, port, name } = config.get('db')

const url = `mongodb://${host}:${port}/${name}`;

mongoose.Promise = global.Promise

module.exports = mongoose.connect(url, (res, err)=> {
  if (err) {
    console.log(`Failed to connect to db on: ${url}`)
  }
  else {
    console.log(`Connected to ${name} db`)
  }
})