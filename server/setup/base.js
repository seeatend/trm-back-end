Object.defineProperty(global, 'nodeEnv', {
  get: () => (process.env.NODE_ENV || 'local')
})
Object.defineProperty(global, 'isDev', {
  get: () => (nodeEnv === 'dev' || nodeEnv === 'local')
})
global.Promise = require('bluebird')
require('dotenv').config()