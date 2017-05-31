module.exports = (query, availableQueries) => {
  result = {}
  availableQueries.forEach((elem) => {
    if (query[elem]) {
      result[elem] = query[elem]
      return result
    }
  })
  return result
}