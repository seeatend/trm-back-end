const mongoose = require('mongoose')
const {Schema} = mongoose
const {applyAlgolia} = require('utils/algolia')

const horseSearchSettings = require('./searchSettings')

const horseDefinition = require('./definition')

const HorseSchema = new Schema(horseDefinition)

const horseHelper = applyAlgolia(HorseSchema, horseSearchSettings)

const HorseModel = mongoose.model('Horse', HorseSchema)

module.exports = {
  horseDefinition,
  horseSearchSettings,
  horseHelper,
  HorseModel
}
