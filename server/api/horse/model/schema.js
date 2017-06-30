const {Schema} = require('mongoose')
const horseDefinition = require('./definition')

module.exports = new Schema(horseDefinition)
