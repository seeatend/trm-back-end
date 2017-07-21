const User = require('api/user/model')

const {expect} = require('chai')

const {registerUser} = require('api/user/register/controller')

const requiredProps = {
  username: 'nick',
  email: 'lovehege@nick.com',
  password: 'lovechrisalso'
}

describe('User - register', () => {
  beforeEach((done) => {
    User.remove({}, () => {
      done()
    })
  })
  describe('/registerUser', () => {
    it('it should register a member', (done) => {
      registerUser(
        requiredProps
      ).then(res => {
        expect(res).to.exist
        expect(res.email).to.equal(requiredProps.email)
        expect(res.type).to.equal('member')
        done()
      })
    })

    it('it should reject registration with wrong email', (done) => {
      registerUser(
        Object.assign({}, requiredProps, {
          email: 'wrong@email'
        })
      ).catch(err => {
        expect(err).to.exist
        done()
      })
    })

    it('it should reject registration with empty username', (done) => {
      registerUser(
        Object.assign({}, requiredProps, {
          username: ''
        })
      ).catch(err => {
        expect(err).to.exist
        done()
      })
    })
  })
})