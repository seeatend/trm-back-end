global.Promise = require('bluebird')
require('./db')

const {Horse} = require('api/horse/model')

Horse.synchronize()
