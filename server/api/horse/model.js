const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types
const mongooseAlgolia = require('mongoose-algolia')
const algoliaClient = require('utils/algoliaClient')

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

horseSchema.plugin(mongooseAlgolia, {
  appId: 'HNO1OL85C6',
  apiKey: '5f295514ff804ecae3614dfbc4ac2de5',
  indexName: 'devHorses', //The name of the index in Algolia, you can also pass in a function
  selector: [
    'name'
  ].join(' '), //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
  debug: true // Default: false -> If true operations are logged out in your console
})

const Horse = mongoose.model('Horse', horseSchema)

Horse.SetAlgoliaSettings({
  searchableAttributes: ['name'] //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
})
Horse.SyncToAlgolia() //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)

const horseIndex = algoliaClient.initIndex('devHorses')

module.exports = {
  horseDefinition,
  horseIndex,
  Horse
}