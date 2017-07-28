if (!global.nodeEnv) {
  Object.defineProperty(global, 'nodeEnv', {
    get: () => (process.env.NODE_ENV || 'local')
  })
}
if (global.isDev === undefined) {
  Object.defineProperty(global, 'isDev', {
    get: () => (nodeEnv === 'dev' || nodeEnv === 'local')
  })
}
if (!global.devLog) {
  global.devLog = message => {
    if (isDev) {
      console.log(message)
    }
  }
}
require('babel-register')
global.Promise = require('bluebird')
require('dotenv').config()