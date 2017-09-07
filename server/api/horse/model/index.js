const mongoose = require('mongoose')
const {Schema} = mongoose
const {applyAlgolia} = require('utils/algolia')
const {removeFilesOnUpdate} = require('utils/mongoose')

const horseSearchSettings = require('./searchSettings')

const horseDefinition = require('./definition')

const HorseSchema = new Schema(horseDefinition)

HorseSchema.plugin(removeFilesOnUpdate, {
  definition: horseDefinition
})

let horseHelper
if (!isTest) {
  horseHelper = applyAlgolia(HorseSchema, horseSearchSettings)
}

const HorseModel = mongoose.model('Horse', HorseSchema)

module.exports = {
  horseDefinition,
  horseSearchSettings,
  horseHelper,
  HorseModel
}
