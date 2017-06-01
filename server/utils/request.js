const path = require('path')
const { move, generateThumbnail, thumbnailPath } = require('./file')

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
    const relativePath = `uploads/${basePath}/${file.filename}`;
    const destination = path.resolve(relativePath)
    let fileObject = {
      path: `/${relativePath}`,
    }

    if (file.fieldname === 'video') {
      const relativeThumbnail = `/${path.relative('./', thumbnailPath(destination))}`
      fileObject.thumbnail = relativeThumbnail
    }

    move(file.path, destination, () => {
      if (file.fieldname === 'video') {
        generateThumbnail(destination)
      }
    })

    result[file.fieldname] = result[file.fieldname] || []
    result[file.fieldname].push(fileObject)
  })
  return result
}