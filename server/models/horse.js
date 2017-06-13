const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
  owner: {
    name: {
      type: String,
      tf: 'ownerFullName'
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
  syndicate: {
    color: {
      type: String,
      tf: 'horseColour'
    }
  },
  performances: [{
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

const HorseSchema = mongoose.model('Horse', new Schema(horseDefinition))

module.exports = {
  horseDefinition,
  HorseSchema
}