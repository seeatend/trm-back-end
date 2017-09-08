const mongoose = require('mongoose')
const {Schema} = mongoose
const {removeFilesOnUpdate} = require('utils/mongoose')
require('api/horse/model')

const syndicateDefinition = require('./definition')

const SyndicateSchema = new Schema(syndicateDefinition)

SyndicateSchema.plugin(removeFilesOnUpdate, {
  definition: syndicateDefinition
})

const SyndicateModel = mongoose.model('Syndicate', SyndicateSchema)

Object.assign(SyndicateModel, {
  syndicateDefinition,
  SyndicateSchema
})

module.exports = SyndicateModel
