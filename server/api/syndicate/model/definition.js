const {ObjectId} = require('mongoose').Schema.Types

module.exports = {
  name: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    file: true,
    default: '/assets/placeholder/featuredImage.jpg'
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
}