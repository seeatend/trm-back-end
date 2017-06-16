const {success, error} = require('utils/request')

const userController = require('api/user/controller')

const prepareOwnership = require('./prepareOwnership')

exports.getDashboard = (req, res) => {
  userController.get(
  ).lean().then(user => {
    if (user) {
      user.ownership = prepareOwnership(user.ownership)
      res.json(success(user))
    }
    else {
      throw new Error('User not found.')
    }
  }).catch(err => {
    console.error(err.message)
    res.json(error(err.message))
  })
}