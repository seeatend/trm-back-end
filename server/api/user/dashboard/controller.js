const {getUser} = require('api/user/controller')

const prepareOwnership = require('./prepareOwnership')

const getDashboard = () => {
  return getUser(
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
      return Promise.resolve(user)
    }
    else {
      return Promise.reject({message: 'User not found.'})
    }
  }).catch(Promise.reject)
}

module.exports = {
  getDashboard
}