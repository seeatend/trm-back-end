const path = require('path')
const mime = require('mime')
const {processFiles} = require('utils/request')

const mockFileUpload = (fieldName, filePath) => {
  let mimeType = mime.lookup(filePath)
  return {
    fieldname: fieldName,
    originalname: filePath,
    mimetype: mimeType,
    filename: filePath,
    path: path.resolve('./uploads/tmp', filePath),
  }
}

const mockHandleUpload = ({data, paths, destination}) => {
  let files = []
  Object.keys(paths).forEach(key => {
    let path = paths[key]
    if (path && path.length > 0) {
      files.push(mockFileUpload(
        key, path
      ))
    }
  })

  return processFiles(
    files, `${destination}/${Date.now()}`
  ).then(filesInfo => {
    if (filesInfo) {
      Object.assign(data, filesInfo)
    }
    return Promise.resolve(data)
  })
}

module.exports = {
  mockFileUpload,
  mockHandleUpload
}