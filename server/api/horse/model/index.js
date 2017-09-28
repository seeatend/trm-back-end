const mongoose = require('mongoose')
const {Schema} = mongoose
const {applyAlgolia} = require('utils/algolia')
const {removeFilesOnUpdate} = require('utils/mongoose')
const {dehyphenize} = require('utils/transforms')

const horseSearchSettings = require('./searchSettings')

const horseDefinition = require('./definition')

const HorseSchema = new Schema(horseDefinition)

HorseSchema.plugin(removeFilesOnUpdate)

let horseHelper
if (!global.isTest) {
  horseHelper = applyAlgolia(HorseSchema, horseSearchSettings)
}

HorseSchema.pre('findOne', function () {
  if (this._conditions.name) {
    this._conditions.name = dehyphenize(this._conditions.name)
  }
})

const HorseModel = mongoose.model('Horse', HorseSchema)

module.exports = {
  horseDefinition,
  horseSearchSettings,
  horseHelper,
  HorseModel
}
