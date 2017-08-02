process.env.NODE_ENV = 'test'

require('./base')

const config = require('config')
const port = config.get('server.port')
const apiVersion = config.get('api.version')
const path = require('path')
const {createDBConnection, closeDBConnection} = require('./db')
const mongoose = require('mongoose')

global.expect = require('chai').expect

global.api = `http://localhost:${port}/api/v${apiVersion}/`

samplesPath = path.resolve('./samples')
global.samples = {
  video: samplesPath + '/video.mp4',
  image: samplesPath + '/image.jpg',
  audio: samplesPath + '/audio.jpg'
}

before((done) => {
  createDBConnection().then(done)
})

after(() => {
  closeDBConnection()
})