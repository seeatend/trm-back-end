const {expect} = require('chai')

const {getHorse, updateOrCreateHorse, removeHorse} = require('api/horse/controller')
const {Horse} = require('api/horse/model')

const {GENERIC} = require('data/messages')

const requiredProps = {
  name: 'To Be Nick'
}

describe('Horse', () => {
  beforeEach((done) => {
    removeHorse().then(() => {
      done()
    })
  })
  describe('/getHorse', () => {
    it('should return not found when no horses', (done) => {
      getHorse(
        requiredProps
      ).catch(err => {
        expect(err.message).to.equal(GENERIC.NOT_FOUND)
        done()
      })
    })

    it('should find existing horse', (done) => {
      updateOrCreateHorse(
        requiredProps
      ).then(res => {
        return getHorse({_id: res._id})
      }).then(res => {
        expect(res).to.exist
        done()
      })
    })
  })
})