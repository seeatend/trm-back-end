const {METHODS} = require('data/messages')
const {safeUpperCase} = require('utils/object')

module.exports = function (_data) {
  let data = Object.assign({}, _data)
  let {syndicateName} = data
  delete data.syndicateName
  if (!syndicateName || syndicateName.length === 0) {
    return Promise.reject({message: METHODS.MISSING_PARAMETER('syndicateName')})
  }
  data.primaryColor = safeUpperCase(data.primaryColor)
  return this.updateOne({
    query: {
      name: safeUpperCase(syndicateName)
    },
    data
  })
    .then(() => (Promise.resolve()))
}
