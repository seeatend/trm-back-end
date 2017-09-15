const HorseController = require('api/horse/controller')
const {GENERIC, METHODS} = require('data/messages')

const dummyHorse = {
  name: 'Test'
}

describe('Horse', () => {
  beforeEach((done) => {
    HorseController.removeAll().then(() => {
      return HorseController.create(dummyHorse)
    }).then(() => {
      done()
    })
  })
  describe('/updateByName', () => {
    it('should update existing horse', (done) => {
      HorseController.updateByName({
        horseName: dummyHorse.name,
        name: 'Test2'
      })
        .then(() => {
          return HorseController.findOne({
            name: 'Test2'
          })
        })
        .then(horse => {
          expect(horse).to.exist()
          done()
        })
    })
    it('should not update not existing horse', (done) => {
      HorseController.updateByName({
        horseName: 'Not existing',
        name: 'Test2'
      })
        .catch(err => {
          expect(err.message).to.equal(GENERIC.NOT_FOUND)
          done()
        })
    })
    it('should not update with horseName only', (done) => {
      HorseController.updateByName({
        horseName: 'Not existing'
      })
        .catch(err => {
          expect(err.message).to.equal(METHODS.MISSING_PARAMETER('data'))
          done()
        })
    })
    it('should not update with data only', (done) => {
      HorseController.updateByName({
        name: 'Test2'
      })
        .catch(err => {
          expect(err.message).to.equal(METHODS.MISSING_PARAMETER('horseName'))
          done()
        })
    })
  })
})
