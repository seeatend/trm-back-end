const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
  trainerId: {
    type: String,
    required: true
  },
  horseId: {
    type: String,
    required: true
  },
  video: {
    type: Array
  },
  image: {
    type: Array
  },
  text: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Message', MessageSchema)