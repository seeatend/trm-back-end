const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types
require('api/horse/model')

const Syndicate = new Schema({
  name: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String
  },
  logo: {
    type: String
  },
  owner: {
    name: {
      type: String
    }
  },
  color: {
    type: String
  },
  horses: [
    { type: ObjectId, ref: 'Horse' }
  ]
})

module.exports = mongoose.model('Syndicate', Syndicate)