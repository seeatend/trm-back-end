const {expect} = require('chai')

const {registerUser} = require('api/user/register/controller')
const {loginUser} = require('api/user/login/controller')
const {removeUser} = require('api/user/controller')
const {AUTHENTICATION, REGISTER} = require('data/messages')
const {NOT_VERIFIED} = require('data/statusCodes')

const registerProps = {
  firstname: 'nick',
  surname: 'the french boy',
  email: 'lovehege@nick.com',
  password: '0loveChrisAlso',
}

const loginProps = {
  email: registerProps.email,
  password: registerProps.password,
}

describe('User/login', () => {
  beforeEach((done) => {
    removeUser().then(() => {
      done()
    })
  })
  describe('/loginUser', () => {
    it('should reject not existing user', (done) => {
      loginUser(
        loginProps
      ).catch(err => {
        expect(err.message).to.equal(AUTHENTICATION.ERROR)
        done()
      })
    })

    it('should reject not verified user', (done) => {
      registerUser(
        registerProps
      ).then(res => {
        expect(res.message).to.equal(REGISTER.SUCCESS)
        return loginUser(
          loginProps
        )
      }).catch(err => {
        expect(err.status).to.equal(NOT_VERIFIED)
        done()
      })
    })

    it('should reject user with already registered email', (done) => {
      registerUser(
        registerProps
      ).then(res => {
        expect(res.message).to.equal(REGISTER.SUCCESS)
        return loginUser(
          loginProps
        )
      }).catch(err => {
        expect(err.status).to.equal(NOT_VERIFIED)
        done()
      })
    })
  })
})