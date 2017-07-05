const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types
const passportLocalMongoose = require('passport-local-mongoose')

const User = new Schema({
  name: {
    type: String
  },
  username: {
    type: String,
    required: String
  },
  type: {
    type: String
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

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User)