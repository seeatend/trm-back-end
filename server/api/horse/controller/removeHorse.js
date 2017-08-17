const {HorseModel} = require('api/horse/model')

module.exports = (body = {}) => {
  return HorseModel.remove(body)
}
