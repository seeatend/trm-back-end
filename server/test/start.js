process.env.NODE_ENV = 'test'

require('setup/db')

const config = require('config')
const port = config.get('server.port')
const apiVersion = config.get('api.version')
const path = require('path')

global.api = `http://localhost:${port}/api/v${apiVersion}/`

samplesPath = path.resolve('./samples')
global.samples = {
  video: samplesPath + '/video.mp4',
  image: samplesPath + '/image.jpg',
  audio: samplesPath + '/audio.jpg'
}
