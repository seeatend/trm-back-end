const SyndicateController = require('api/syndicate/controller')
const {GENERIC, METHODS} = require('data/messages')

const dummySyndicate = {
  name: 'Test'
}

describe('syndicate', () => {
  beforeEach((done) => {
    SyndicateController.removeAll().then(() => {
      return SyndicateController.create(dummySyndicate)
    }).then(() => {
      done()
    })
  })
  describe('/updateByName', () => {
    it('should update existing syndicate', (done) => {
      SyndicateController.updateByName({
        syndicateName: dummySyndicate.name,
        name: 'Test2'
      })
        .then(() => {
          return SyndicateController.findOne({
            name: 'Test2'
          })
        })
        .then(syndicate => {
          expect(syndicate).to.exist()
          done()
        })
    })
    it('should not update not existing syndicate', (done) => {
      SyndicateController.updateByName({
        syndicateName: 'Not existing',
        name: 'Test2'
      })
        .catch(err => {
          expect(err.message).to.equal(GENERIC.NOT_FOUND)
          done()
        })
    })
    it('should not update with syndicateName only', (done) => {
      SyndicateController.updateByName({
        syndicateName: 'Not existing'
      })
        .catch(err => {
          expect(err.message).to.equal(METHODS.MISSING_PARAMETER('data'))
          done()
        })
    })
    it('should not update with data only', (done) => {
      SyndicateController.updateByName({
        name: 'Test2'
      })
        .catch(err => {
          expect(err.message).to.equal(METHODS.MISSING_PARAMETER('syndicateName'))
          done()
        })
    })
  })
})
