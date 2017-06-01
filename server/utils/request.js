const path = require('path')
const { move } = require('./file')

exports.prepareQuery = (query, availableQueries) => {
  result = {}
  availableQueries.forEach((elem) => {
    if (query[elem]) {
      result[elem] = query[elem]
      return result
    }
  })
  return result
}

exports.processFiles = (files, basePath) => {
  const result = {}
  files.forEach(file => {
    const destination = path.resolve(`uploads/${basePath}/${file.filename}`)

    move(file.path, destination)

    result[file.fieldname] = result[file.fieldname] || []
    result[file.fieldname].push({
      path: destination
    })
  })
  return result
}