const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types

const horseDefinition = {
  timeFormId: {
    type: String,
    tf: 'horseCode'
  },
  name: {
    type: String,
    tf: 'horseName'
  },
  age: {
    type: String,
    tf: 'horseAge'
  },
  gender: {
    type: String,
    tf: 'horseGender'
  },
  color: {
    type: String,
    tf: 'horseColour'
  },
  owner: {
    _id: {
      type: ObjectId
    },
    color: {
      type: String
    },
    name: {
      type: String,
      tf: 'ownerFullName'
    }
  },
  foalingDate: {
    type: Date,
    tf: 'foalingDate'
  },
  sire: {
    name: {
      type: String,
      tf: 'sireName'
    }
  },
  dam: {
    name: {
      type: String,
      tf: 'damName'
    },
    sireName: {
      type: String,
      tf: 'damSireName'
    }
  },
  trainer: {
    name: {
      type: String,
      tf: 'trainerFullName'
    }
  },
  performances: [{
    _id: false,
    date: {
      type: Date,
      tf: 'meetingDate'
    },
    position: {
      official: {
        type: Number,
        tf: 'positionOfficial'
      }
    }
  }]
}

const Horse = mongoose.model('Horse', new Schema(horseDefinition))

module.exports = {
  horseDefinition,
  Horse
}