const config = require('config')
const path = require('path')
const mime = require('mime')
const {move, generateThumbnail, thumbnailPath} = require('./file')

const prepareQuery = (query, availableQueries, transform = val => val) => {
  let result = {}
  availableQueries.forEach((elem) => {
    if (query[elem]) {
      result[elem] = transform(elem, query[elem])
      return result
    }
  })
  if (Object.keys(result).length === 0) {
    result = null
  }
  return result
}

const dehyphenize = query => (query || '').trim().replace(/[-]+/g, ' ').toUpperCase()

const hyphenize = query => query.trim().replace(/[ ]+/g, '-').toLowerCase()

const isId = id => id.match(/^[0-9a-fA-F]{24}$/)

const success = value => {
  return {status: 'success', data: value}
}

const error = message => {
  if (!message) message = 'Wrong parameters'
  return {status: 'error', message}
}

const processFile = (file, destination) => {
  const relativePath = `${config.get('storage.path')}/${destination}/${file.filename}`
  const destinationPath = path.resolve(relativePath)
  if (mime.lookup(file.originalname) === file.mimetype) {
    const type = file.mimetype.slice(0, file.mimetype.indexOf('/'))

    let fileObject = {
      path: `/${relativePath}`,
      type
    }

    if (type === 'video') {
      const relativeThumbnail = `/${path.relative('./', thumbnailPath(destinationPath))}`
      fileObject.thumbnail = relativeThumbnail
    }

    move(file.path, destinationPath, () => {
      if (type === 'video') {
        generateThumbnail(destinationPath)
      }
    })

    return fileObject
  }
  else {
    return {
      error: true,
      message: 'mime type doesn\'t match extension'
    }
  }
}

const processFiles = (files, destination) => {
  const results = []
  if (!Array.isArray(files)) {
    let newFiles = []
    Object.keys(files).forEach(key => {
      newFiles = newFiles.concat(files[key])
    })
    files = newFiles
  }
  files.forEach(file => {
    let result = processFile(file, destination)
    if (result && result.error) {
      return result
    }
    else {
      results.push(result)
    }
  })
  return results
}

module.exports = {
  prepareQuery,
  dehyphenize,
  hyphenize,
  isId,
  success,
  error,
  processFile,
  processFiles
}