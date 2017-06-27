const {horseIndex} = require('api/horse/model')

module.exports = (body) => {
  if (body.name && body.name.length > 0) {
    let name = body.name.toUpperCase()
    return horseIndex.search(name)
  }
  else {
    return Promise.reject()
  }
}