const {expect} = require('chai')
const {Controller} = require('api/utils')
const mongoose = require('mongoose')
const {Schema} = mongoose

const TestSchema = new Schema({
  name: {
    type: String
  }
})

let saveCalled = 0
TestSchema.pre('save', (next) => {
  saveCalled++
  next()
})

const TestModel = mongoose.model('Test', TestSchema)

const TestController = new Controller({
  model: TestModel
})

describe('api/utils/Controller', () => {
  beforeEach((done) => {
    saveCalled = 0
    done()
  })

  describe('/updateById', () => {
    it('should call save hook once', (done) => {
      TestController.create({
        name: 'Test'
      }).then(res => {
        return TestController.updateById({
          id: res._id,
          data: {
            name: 'New'
          }
        })
      }).then(() => {
        expect(saveCalled).to.equal(1)
        done()
      })
    })
  })
})