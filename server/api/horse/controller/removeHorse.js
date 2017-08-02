const {Horse} = require('api/horse/model')

module.exports = (body = {}) => {
  return Horse.remove(body)
}
