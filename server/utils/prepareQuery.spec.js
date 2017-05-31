const { expect } = require('chai')

const prepareQuery = require('./prepareQuery')

describe('Utils - prepareQuery', () => {
  it('should extract correct query', () => {
    const availableQueries = ['horseId']

    const query = {
      horseId: 'hello',
      redundantProp: 'world'
    }

    expect(prepareQuery(query, availableQueries)).to.eql({horseId: query.horseId})
  })
})