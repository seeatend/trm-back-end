const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types

const User = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  horses: [{
    id: ObjectId,
    shares: {
      owned: Number
    }
  }]
})

module.exports = mongoose.model('User', User)