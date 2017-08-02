if (!global.nodeEnv) {
  Object.defineProperty(global, 'nodeEnv', {
    get: () => (process.env.NODE_ENV || 'local')
  })
}
if (global.isUat === undefined) {
  Object.defineProperty(global, 'isUat', {
    get: () => (nodeEnv === 'uat')
  })
}
if (global.isDev === undefined) {
  Object.defineProperty(global, 'isDev', {
    get: () => (nodeEnv === 'dev' || nodeEnv === 'local')
  })
}
if (global.isLocal === undefined) {
  Object.defineProperty(global, 'isLocal', {
    get: () => (nodeEnv === 'local')
  })
}
if (global.isTest === undefined) {
  Object.defineProperty(global, 'isTest', {
    get: () => (nodeEnv === 'test')
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