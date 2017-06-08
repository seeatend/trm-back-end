const config = require('config')
const path = require('path')
const mime = require('mime')
const {move, generateThumbnail, thumbnailPath} = require('./file')

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
  const result = []
  if (!Array.isArray(files)) {
    let newFiles = []
    Object.keys(files).forEach(key => {
      newFiles = newFiles.concat(files[key])
    })
    files = newFiles
  }
  files.forEach(file => {
    const relativePath = `${config.get('storage.path')}/${basePath}/${file.filename}`
    const destination = path.resolve(relativePath)
    if (mime.lookup(file.originalname) === file.mimetype) {
      const type = file.mimetype.slice(0, file.mimetype.indexOf('/'))

      let fileObject = {
        path: `/${relativePath}`,
        type
      }

      if (type === 'video') {
        const relativeThumbnail = `/${path.relative('./', thumbnailPath(destination))}`
        fileObject.thumbnail = relativeThumbnail
      }

      move(file.path, destination, () => {
        if (type === 'video') {
          generateThumbnail(destination)
        }
      })

      result.push(fileObject)
    }
    else {
      return {
        error: true,
        message: 'mime type doesn\'t match extension'
      }
    }
  })
  return result
}