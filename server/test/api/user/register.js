const User = require('api/user/model')

const {expect} = require('chai')

const {registerUser} = require('api/user/register/controller')

const requiredProps = {
  firstname: 'nick',
  surname: 'the french boy',
  email: 'lovehege@nick.com',
  password: '0loveChrisAlso',
}

const successMessage = 'User has been created.'

describe('User - register', () => {
  beforeEach((done) => {
    User.remove({}, () => {
      done()
    })
  })
  describe('/registerUser', () => {
    it('it should register a member', (done) => {
      registerUser(
        requiredProps,
        {returnUser: true}
      ).then(user => {
        expect(user).to.exist
        expect(user.email).to.equal(requiredProps.email)
        expect(user.type).to.equal('member')
        done()
      })
    })

    it('it should reject registration with wrong email', (done) => {
      registerUser(
        Object.assign({}, requiredProps, {
          email: 'wrong@email'
        }),
        {returnUser: true}
      ).catch(err => {
        expect(err).to.exist
        done()
      })
    })

    it('it should reject registration with empty firstname', (done) => {
      registerUser(
        Object.assign({}, requiredProps, {
          firstname: ''
        }),
        {returnUser: true}
      ).catch(err => {
        expect(err).to.exist
        done()
      })
    })
  })
})