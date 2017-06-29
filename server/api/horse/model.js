const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types
const {applyAlgolia} = require('utils/algolia')

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
    type: Number,
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
  shares: {
    owned: {
      type: Number
    },
    total: {
      type: Number
    }
  },
  cost: {
    share: Number,
    initial: Number
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

let horseSchema = new Schema(horseDefinition)

let horseIndex = applyAlgolia(horseSchema, {
  indexName: 'Horses',
  sort: [
    'sharesAvailable',
    'shareCost'
  ],
  selector: [
    'name'
  ],
  virtuals: {
    sharesAvailable: horse => ((horse.shares.total - horse.shares.owned)/horse.shares.total),
    shareCost: horse => (horse.cost.share)
  }
})

const Horse = mongoose.model('Horse', horseSchema)

Horse.SetAlgoliaSettings({
  searchableAttributes: ['name'] //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
})
Horse.SyncToAlgolia() //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)

module.exports = {
  horseDefinition,
  horseIndex,
  Horse
}