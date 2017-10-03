const {METHODS} = require('data/messages')
const {safeUpperCase} = require('utils/object')

module.exports = function (_data) {
  let data = Object.assign({}, _data)
  let {horseName} = data
  delete data.horseName
  if (!horseName || horseName.length === 0) {
    return Promise.reject({message: METHODS.MISSING_PARAMETER('horseName')})
  }
  return this.updateOne({
    query: {
      name: safeUpperCase(horseName)
    },
    data
  })
    .then(() => (Promise.resolve()))
}
