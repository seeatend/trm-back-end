const {METHODS} = require('data/messages')

module.exports = function (_data) {
  let data = Object.assign({}, _data)
  let {horseName} = data
  delete data.horseName
  if (!horseName || horseName.length === 0) {
    return Promise.reject({message: METHODS.MISSING_PARAMETER('horseName')})
  }
  return this.updateOne({
    query: {
      name: horseName.toUpperCase()
    },
    data
  })
    .then(() => (Promise.resolve()))
}
