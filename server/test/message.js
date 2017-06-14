const fs = require('fs')

const Message = require('api/message/model')

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.should()

chai.use(chaiHttp)

const requiredProps = {
  trainerId: 'sthst',
  horseId: 5,
}

describe('Messages', () => {
  beforeEach((done) => {
    Message.remove({}, () => {
      done()
    })
  })
  describe('/GET message', () => {
    it('it should GET all the messages', (done) => {
      chai.request(
        api
      ).get(
        'message'
      ).then(res => {
        let data = res.body.data
        if (data) {
          res.should.have.status(200)
          data.should.be.a('array')
          data.length.should.be.eql(0)
          done()
        }
        else { throw new Error('data is undefined')}
      }).catch(error => {
        console.log(error)
      })
    })
  })
  describe('/POST message', () => {
    it('it should POST the message', (done) => {
      chai.request(
        api
      ).post(
        'message'
      ).field(
        'trainerId', requiredProps.trainerId
      ).field(
        'horseId', requiredProps.horseId
      ).attach(
        'attachment', fs.readFileSync(samples.video), 'video.mp4'
      ).end().then(res => {
        res.should.have.status(200)
        return chai.request(api)
          .get('message')
          .query({horseId: requiredProps.horseId})
          .end()
      }).catch(error => {
        // TODO: fix double response/callback error
      }).then(res => {
        let data = res.body.data
        if (data) {
          res.should.have.status(200)
          data.should.be.a('array')
          data.length.should.be.eql(1)
          done()
        }
        else { throw new Error('data is undefined')}
      }).catch(error => {
        console.log('Error on getting')
        console.log(error)
      })
    })
  })
})