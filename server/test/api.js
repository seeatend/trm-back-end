const mongoose = require("mongoose")
const Message = mongoose.model('Message')

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.should()

chai.use(chaiHttp)

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
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(0)
          done()
        })
    })
  })
})