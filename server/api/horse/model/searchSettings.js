module.exports = {
  modelName: 'Horse',
  searchableAttributes: ['name'],
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
}