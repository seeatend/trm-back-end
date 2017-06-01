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
  if (!Array.isArray(files)) {
    let newFiles = []
    Object.keys(files).forEach(key => {
      newFiles = newFiles.concat(files[key])
    })
    files = newFiles
  }
  files.forEach(file => {
    let relativePath = `uploads/${basePath}/${file.filename}`;
    const destination = path.resolve(relativePath)

    move(file.path, destination)

    result[file.fieldname] = result[file.fieldname] || []
    result[file.fieldname].push({
      path: `/${relativePath}`
    })
  })
  return result
}