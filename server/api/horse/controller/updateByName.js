module.exports = function(_data) {
  let data = Object.assign({}, _data)
  let {horseName} = data
  delete data.horseName
  if (!(horseName && horseName.length > 0) || Object.keys(data).length === 0) return Promise.reject()
  return this.updateOne({
    query: {
      name: horseName.toUpperCase()
    },
    data
  })
}