const path = require('path')
const mongoose = require('mongoose')
const {Schema} = mongoose
const {removeFile} = require('utils/file')
require('api/horse/model')

const syndicateDefinition = require('./definition')

const SyndicateSchema = new Schema(syndicateDefinition)

Object.keys(syndicateDefinition).forEach(key => {
  let field = syndicateDefinition[key]
  if (field.file) {
    SyndicateSchema.path(key).set(function (newVal) {
      let oldVal = this[key]
      if (!field.default || oldVal !== field.default) {
        removeFile(oldVal)
      }
      return newVal
    })
  }
})

const SyndicateModel = mongoose.model('Syndicate', SyndicateSchema)

Object.assign(SyndicateModel, {
  syndicateDefinition,
  SyndicateSchema
})

module.exports = SyndicateModel