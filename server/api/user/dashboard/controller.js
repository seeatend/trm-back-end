const {success, error} = require('utils/request')

const {getUser} = require('api/user/controller')

const prepareOwnership = require('./prepareOwnership')

const getDashboard = (req, res) => {
  getUser(
    null,
    {
      __v: false,
      timeformId: false,
      timeformComments: false,
      description: false,
      foalingDate: false,
      color: false,
      sire: false,
      dam: false
    }
  ).lean().then(user => {
    if (user) {
      user.ownership = prepareOwnership(user.ownership)
      res.json(success(user))
    }
    else {
      throw new Error('User not found.')
    }
  }).catch(err => {
    console.error(err)
    res.status(404).json(error(err.message))
  })
}

module.exports = {
  getDashboard
}