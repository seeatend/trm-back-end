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
  ownership: [{
    _id: false,
    horse: {
      type: ObjectId,
      ref: 'Horse'
    },
    shares: {
      owned: {
        type: Number
      },
      total: {
        type: Number
      }
    }
  }]
})

module.exports = mongoose.model('User', User)