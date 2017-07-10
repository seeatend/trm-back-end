module.exports = {
  modelName: 'Horse',
  searchableAttributes: ['name'],
  sortBy: [
    'shares.available',
    'cost.monthly'
  ],
  filterBy: [
    'age',
    'hasBeenRaced',
    'cost',
    'racingType',
    'ownership'
  ],
  mappings: {
    shares: (value) => ({
      available: (value.total - value.owned) / value.total
    })
  },
  selector: [
    'name',
    'age',
    'racingType',
    'cost',
    'shares',
    'ownership',
    'owner.name',
    'trainer.name'
  ],
  virtuals: {
    hasBeenRaced: horse => (horse.performances ? horse.performances.length > 0 : false),
  }
}