// const {createUser} = require('api/user/register/controller')
// const {verifyUser} = require('api/user/verify/controller')
const {removeUser} = require('api/user/controller')

// const createProps = {
//   firstname: 'nick',
//   surname: 'the french boy',
//   email: 'lovehege@nick.com',
//   password: '0loveChrisAlso'
// }

describe('User/verify', () => {
  beforeEach((done) => {
    removeUser().then(() => {
      done()
    })
  })
  // describe('/verifyUser', () => {
  //   it('should verify not verified user', (done) => {
  //     createUser(
  //       createProps
  //     ).then(verification => {
  //       return verifyUser({
  //         token: verification
  //       })
  //     }).then(res => {
  //       expect(res.token).to.be.a('string')
  //       expect(res.user.firstname).to.equal(createProps.firstname)
  //       done()
  //     })
  //   })
  // })
})
