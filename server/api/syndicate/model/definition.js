const {ObjectId} = require('mongoose').Schema.Types

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
  logo: {
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
  horses: [
    { type: ObjectId, ref: 'Horse' }
  ]
}
