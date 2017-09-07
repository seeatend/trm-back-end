module.exports = function (_data) {
  let data = Object.assign({}, _data)
  let {syndicateName} = data
  delete data.syndicateName
  if (!(syndicateName && syndicateName.length > 0) || Object.keys(data).length === 0) return Promise.reject()
  return this.updateOne({
    query: {
      name: syndicateName.toUpperCase()
    },
    data
  })
}
