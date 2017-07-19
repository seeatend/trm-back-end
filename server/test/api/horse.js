const {Horse} = require('api/horse/model')

const {expect} = require('chai')

const {updateHorse} = require('api/horse/controller')

const requiredProps = {
  name: 'To be Nick'
}

describe('Horses', () => {
  beforeEach((done) => {
    Horse.remove({}, () => {
      done()
    })
  })
  describe('/update horse', () => {
    it('it should create horse', (done) => {
      updateHorse(
        requiredProps
      ).then(res => {
        expect(res).to.exist
        expect(res.name).to.eql(requiredProps.name)
        done()
      })
    })
  })
})