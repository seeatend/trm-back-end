const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types
require('api/horse/model')

const Syndicate = new Schema({
  name: {
    type: String
  },
  featuredImage: {
    type: String
  },
  logo: {
    type: String
  },
  owner: {
    type: String,
    required: true
  },
  color: {
    type: String
  },
  horses: [
    { type: ObjectId, ref: 'Horse' }
  ]
})

module.exports = mongoose.model('Syndicate', Syndicate)