const {applyAlgolia} = require('utils/algolia')
const horseSearchSettings = require('./searchSettings')
const horseSchema = require('./schema')

module.exports = applyAlgolia(horseSchema, horseSearchSettings)
