const {prepareUserData} = require('utils/authentication')

const getSetup = (body, {user}) => {
  return Promise.resolve(prepareUserData(user))
}

module.exports = {
  getSetup
}