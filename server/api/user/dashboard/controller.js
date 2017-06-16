const {success, error} = require('utils/request')

const userController = require('api/user/controller')

exports.getDashboard = (req, res) => {
  userController.get(
  ).then(user => {
    res.json(success(user))
  }).catch(err => {
    console.error(err.message)
    res.json(error(err.message))
  })
}