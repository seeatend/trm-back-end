const fs = require('fs')

const mongoose = require('mongoose')
const Message = mongoose.model('Message')

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
      chai.request(api)
        .get('message')
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.length.should.be.eql(0)
            done()
          }
          else {
            console.log(err)
          }
        })
    })
  })
  describe('/POST message', () => {
    it('it should POST the message', (done) => {
      chai.request(api)
        .post('message')
        .field('trainerId', requiredProps.trainerId)
        .field('horseId', requiredProps.horseId)
        .attach('attachment', fs.readFileSync(samples.video), 'video.mp4')
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200)
            chai.request(api)
              .get('message')
              .query({horseId: requiredProps.horseId})
              .end((err, res) => {
                if (!err) {
                  res.should.have.status(200)
                  res.body.should.be.a('array')
                  res.body.length.should.be.eql(1)
                  done()
                }
                else {
                  console.log(err)
                }
              })
          }
          else {
            console.log(err)
          }
        })
    })
  })
})