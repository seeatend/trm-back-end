const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types
require('api/horse/model')

const Syndicate = new Schema({
  name: {
    type: String,
    required: true
  },
  horses: [
    { type: ObjectId, ref: 'Horse' }
  ]
})

module.exports = mongoose.model('Syndicate', Syndicate)