const mongoose = require('mongoose')
const {Schema} = mongoose
const {applyAlgolia} = require('utils/algolia')

let horseSchema = new Schema(require('./definition'))

let horseIndex = applyAlgolia(horseSchema, {
  indexName: 'Horses',
  sortBy: [
    'sharesAvailable',
    'monthlyCost'
  ],
  filterBy: [
    'age',
    'hasBeenRaced',
    'monthlyCost',
    'initialCost',
    'racingType',
    'ownershipType',
    'numberOfYears'
  ],
  selector: [
    'name',
    'age',
    'racingType'
  ],
  virtuals: {
    sharesAvailable: horse => ((horse.shares.total - horse.shares.owned)/horse.shares.total),
    monthlyCost: horse => (horse.cost.monthly),
    initialCost: horse => (horse.cost.initial),
    hasBeenRaced: horse => (horse.performances.length > 0),
    ownershipType: horse => (horse.ownership.type),
    numberOfYears: horse => (horse.ownership.years)
  }
})

const Horse = mongoose.model('Horse', horseSchema)

Horse.SetAlgoliaSettings({
  searchableAttributes: ['name'] //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
})
Horse.SyncToAlgolia() //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)

module.exports = {
  Horse,
  horseIndex
}