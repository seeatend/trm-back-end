const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types
const mongoosastic = require('mongoosastic')
const esClient = require('utils/esClient')

const horseDefinition = {
  timeformId: {
    type: String,
    tf: 'horseCode'
  },
  name: {
    type: String,
    tf: 'horseName',
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
  featuredImage: {
    type: String,
    default: '/assets/placeholder/featuredImage.jpg'
  },
  thumbnailImage: {
    type: String
  },
  description: {
    type: String
  },
  style: {
    type: String
  },
  timeformComments: {
    flat: {
      type: String,
      tf: 'productionCommentFlat'
    },
    jump: {
      type: String,
      tf: 'productionCommentJump'
    }
  },
  manager: {
    name: {
      type: String
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
        es_type: 'double',
        tf: 'positionOfficial'
      }
    }
  }]
}

let horseSchema = new Schema(horseDefinition)

horseSchema.plugin(mongoosastic, {esClient})

const Horse = mongoose.model('Horse', horseSchema)

Horse.createMapping(function (err, mapping) {
  if (err) {
    console.log('error creating mapping (you can safely ignore this)')

    console.log(err)
  } else {
    console.log('mapping created!')
    console.log(mapping)
  }
})


module.exports = {
  horseDefinition,
  Horse
}