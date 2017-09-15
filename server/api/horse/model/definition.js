const {ObjectId} = require('mongoose').Schema.Types
const {
  OWNERSHIP_TYPE,
  RACING_TYPE,
  STYLE
} = require('./constants')

module.exports = {
  timeformId: {
    type: String, tf: 'horseCode'
  },
  name: {
    type: String,
    tf: 'horseName',
    uppercase: true,
    required: true
  },
  age: {
    type: Number, tf: 'horseAge'
  },
  gender: {
    type: String, tf: 'horseGender'
  },
  color: {
    type: String, tf: 'horseColour'
  },
  featuredImage: {
    type: String,
    default: '/assets/placeholder/featuredImage.jpg',
    file: true
  },
  thumbnailImage: {
    type: String,
    default: '/assets/placeholder/thumbnailImage.jpg',
    file: true
  },
  description: {
    type: String
  },
  style: {
    type: String,
    enum: STYLE
  },
  timeformComments: {
    flat: {
      type: String, tf: 'productionCommentFlat'
    },
    jump: {
      type: String, tf: 'productionCommentJump'
    }
  },
  manager: {
    name: {
      type: String
    }
  },
  shares: {
    owned: {
      type: Number
    },
    total: {
      type: Number
    }
  },
  racingType: {
    type: String,
    enum: RACING_TYPE
  },
  cost: {
    monthly: Number,
    initial: Number
  },
  ownership: {
    type: {
      type: String,
      enum: OWNERSHIP_TYPE
    },
    years: {
      type: Number,
      min: 1
    }
  },
  owner: {
    _id: {
      type: ObjectId
    },
    color: {
      type: String
    },
    name: {
      type: String, tf: 'ownerFullName'
    }
  },
  foalingDate: {
    type: Date, tf: 'foalingDate'
  },
  sire: {
    name: {
      type: String, tf: 'sireName'
    }
  },
  dam: {
    name: {
      type: String, tf: 'damName'
    },
    sireName: {
      type: String, tf: 'damSireName'
    }
  },
  trainer: {
    name: {
      type: String, tf: 'trainerFullName'
    }
  },
  performances: [{
    _id: false,
    date: {
      type: Date, tf: 'meetingDate'
    },
    position: {
      official: {
        type: Number, tf: 'positionOfficial'
      }
    }
  }]
}
