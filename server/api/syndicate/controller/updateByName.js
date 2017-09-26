const {METHODS} = require('data/messages')

module.exports = function (_data) {
  let data = Object.assign({}, _data)
  let {syndicateName} = data
  delete data.syndicateName
  if (!syndicateName || syndicateName.length === 0) {
    return Promise.reject({message: METHODS.MISSING_PARAMETER('syndicateName')})
  }
  return this.updateOne({
    query: {
      name: syndicateName.toUpperCase()
    },
    data
  })
    .then(() => (Promise.resolve()))
}
