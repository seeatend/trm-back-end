const {
  OWNERSHIP_TYPE,
  RACING_TYPE,
  RACING_HISTORY
} = require('./constants')

module.exports = {
  modelName: 'Horse',
  searchableAttributes: ['name'],
  sortBy: [
    {
      field: 'shares.available',
      displayName: 'Shares',
      order: ['desc', 'asc']
    },
    {
      field: 'cost.monthly',
      displayName: 'Price',
      order: ['desc', 'asc']
    }
  ],
  filterBy: {
    'age': {
      displayName: 'Age of horse',
      options: [
        {
          min: 0,
          max: 2,
          displayName: '0-2'
        },
        {
          min: 3,
          max: 5,
          displayName: '3-5'
        },
        {
          min: 6,
          displayName: 'Older horse'
        }
      ]
    },
    'racingHistory': {
      displayName: 'Racing history',
      values: RACING_HISTORY
    },
    'cost.monthly': {
      displayName: 'Monthly cost per 1%',
      values: {
        min: 1000,
        max: 30000
      }
    },
    'racingType': {
      displayName: 'Racing type',
      values: RACING_TYPE
    },
    'ownership.years': {
      displayName: 'Number of years',
      default: 2,
      values: {
        min: 0
      }
    },
    'ownership.type': {
      displayName: 'Ownership type',
      values: OWNERSHIP_TYPE
    }
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
  mappings: {
    shares: (value) => ({
      available: (value.total - value.owned) / value.total
    })
  },
  virtuals: {
    racingHistory: horse => (horse.performances ? horse.performances.length > 0 ? RACING_HISTORY[1] : RACING_HISTORY[0] : RACING_HISTORY[0]),
  }
}