const {Controller} = require('api/utils')
const UserModel = require('api/user/model')

const UserController = new Controller({
  model: UserModel,
  methods: {
    getShares: require('./getShares'),
    updateUser: require('./updateUser')
  }
})

module.exports = UserController
