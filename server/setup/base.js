if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'local'
}
Object.defineProperty(global, 'isDev', {
  get: () => (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'local')
})
global.Promise = require('bluebird')
require('dotenv').config()