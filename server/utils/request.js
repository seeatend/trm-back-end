const config = require('config')
const path = require('path')
const mime = require('mime')
const {move, generateThumbnail, thumbnailPath} = require('./file')
const fs = require('fs-extra')

const prepareQuery = (query, availableQueries, transform = (key, val) => val) => {
  if (!query) {
    throw new Error(`Query is not defined ${JSON.stringify(availableQueries)}`)
  }
  let result = {}
  availableQueries.forEach((elem) => {
    if (query[elem]) {
      result[elem] = transform(elem, query[elem])
      return result
    }
  })
  if (Object.keys(result).length === 0) {
    throw new Error(`No matching queries ${JSON.stringify(availableQueries)}`)
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
  const relativePath = `${config.get('storage.path')}/${destination}/${file.filename}`.replace(/\s/g, '-')
  const destinationPath = path.resolve(relativePath)
  return new Promise((resolve, reject) => {
    if (mime.lookup(file.originalname) === file.mimetype) {
      const type = file.mimetype.slice(0, file.mimetype.indexOf('/'))

      let fileObject = {
        fieldName: file.fieldname,
        path: `/${relativePath}`,
        type
      }

      fs.move(
        file.path, destinationPath
      ).then(() => {
        if (type === 'video') {
          generateThumbnail(
            destinationPath
          ).then(thumbnailPath => {
            fileObject.thumbnail = `/${path.relative('./', thumbnailPath)}`
            resolve(fileObject)
          }).catch(reject)
        }
        else {
          resolve(fileObject)
        }
      }).catch(reject)

      return fileObject
    }
    else {
      reject({message: 'mime type doesn\'t match extension'})
    }
  })
}

const processFiles = (files, destination) => {
  if (!Array.isArray(files)) {
    let newFiles = []
    Object.keys(files).forEach(key => {
      newFiles = newFiles.concat(files[key])
    })
    files = newFiles
  }
  return new Promise((resolve, reject) => {
    if (!files || files && files.length === 0) {
      resolve(null)
      return
    }
    let promises = []
    files.forEach(file => {
      promises.push(processFile(file, destination))
    })

    Promise.all(
      promises
    ).then(fileObjects => {
      let results = {}
      fileObjects.forEach(fileObject => {
        let fieldName = fileObject.fieldName
        delete fileObject.fieldName
        if (!results[fieldName]) {
          results[fieldName] = []
        }
        results[fieldName].push(fileObject)
      })
      resolve(results)
    }).catch(reject)
  })
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