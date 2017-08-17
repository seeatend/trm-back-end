const multer = require('multer')
const mime = require('mime')
const path = require('path')
const config = require('config')
const {extension} = require('utils/file')
const {processMulterFiles} = require('utils/request')
const mkdirp = require('mkdirp')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destination = path.resolve(`./${config.get('storage.path')}/tmp`)
    mkdirp(destination, cb.bind(this, null, destination))
  },
  filename: (req, file, cb) => {
    let fieldName = file.fieldname
    let fileName = `${fieldName}-${Date.now()}.${extension(file.originalname)}`
    cb(null, fileName)
  }
})

const handleUpload = ({field, acceptedTypes = ['image'], destination = 'other'}) => {
  let type = field.limit > 1 ? 'array' : 'single'
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const type = file.mimetype.slice(0, file.mimetype.indexOf('/'))
      const isExtensionCorrect = mime.lookup(file.originalname) === file.mimetype
      const isOfAcceptedType = ~acceptedTypes.indexOf(type)

      if (isOfAcceptedType && isExtensionCorrect) {
        cb(null, true)
      }
      else {
        cb(null, false)
      }
    }
  }).array(field.name)

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        res.send({error: true, message: 'File upload failed'})
      }
      else {
        const {body, files} = req
        if (files && files.length > 0) {
          processMulterFiles(
            files, type, field.name, destination
          ).then(result => {
            body[field.name] = result
            next()
          }).catch(err => {
            console.error(err)
            res.send(err.message)
          })
        }
        else {
          next()
        }
      }
    })
  }
}

module.exports = handleUpload