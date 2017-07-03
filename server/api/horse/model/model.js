const mongoose = require('mongoose')
const horseSchema = require('./schema')

module.exports = mongoose.model('Horse', horseSchema)