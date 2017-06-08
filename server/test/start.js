process.env.NODE_ENV = 'test'

require('index')

const config = require('config')
const port = config.get('server.port')
const apiVersion = config.get('api.version')

global.api = `http://localhost:${port}/api/v${apiVersion}/`
