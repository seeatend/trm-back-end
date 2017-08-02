const {expect} = require('chai')

const {updateOrCreateHorse, removeHorse} = require('api/horse/controller')

const requiredProps = {
  name: 'To Be Nick'
}

describe('Horse', () => {
  beforeEach((done) => {
    removeHorse().then(() => {
      done()
    })
  })
  describe('/updateOrCreateHorse', () => {
    it('should create horse', (done) => {
      updateOrCreateHorse(
        requiredProps
      ).then(res => {
        expect(res).to.exist
        expect(res.name).to.eql(requiredProps.name)
        done()
      })
    })

    it('should update horse', (done) => {
      let additionalData = {
        trainer: {
          name: 'Hege'
        }
      }
      updateOrCreateHorse(
        requiredProps
      ).then(horse => {
        return updateOrCreateHorse(
          {name: horse.name},
          additionalData
        )
      }).then(horse => {
        expect(horse).to.exist
        expect(horse.name).to.eql(requiredProps.name)
        expect(horse.trainer.name).to.eql(additionalData.trainer.name)
        done()
      })
    })
  })
})