const {ObjectId} = require('mongoose').Schema.Types
const {PRIMARY_COLOR} = require('./constants')

module.exports = {
  name: {
    type: String,
    uppercase: true,
    required: true
  },
  featuredImage: {
    type: String,
    file: true,
    default: '/assets/placeholder/featuredImage.jpg'
  },
  logoImage: {
    type: String,
    file: true
  },
  owner: {
    name: {
      type: String
    }
  },
  description: {
    type: String
  },
  color: {
    type: String
  },
  primaryColor: {
    type: String,
    enum: PRIMARY_COLOR
  },
  headline1: {
    type: String
  },
  headline2: {
    type: String
  },
  benefits: {
    type: String
  },
  horses: [
    { type: ObjectId, ref: 'Horse' }
  ]
}
