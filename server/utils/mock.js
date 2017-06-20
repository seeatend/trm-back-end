const path = require('path')
const mime = require('mime')

module.exports = {
  mockFileUpload: (fieldName, filePath) => {
    let mimeType = mime.lookup(filePath)
    multerMockData = {
      fieldname: fieldName,
      originalname: filePath,
      mimetype: mimeType,
      filename: filePath,
      path: path.resolve('./uploads/tmp', filePath),
    }
  }
}