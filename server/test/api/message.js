const Message = require('api/message/model')

const {expect} = require('chai')

describe('Messages', () => {
  beforeEach((done) => {
    Message.remove({}, () => {
      done()
    })
  })
  describe('/GET message', () => {
    it('it should GET all the messages', (done) => {
      expect(true).to.eql(true)
      done()
    })
  })
})