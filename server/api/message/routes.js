const express = require('express')
const multer = require('multer')
const mime = require('mime')
const path = require('path')
const mkdirp = require('mkdirp')
const config = require('config')

const {extension} = require('utils/file')

const messageRouter = express.Router({mergeParams: true})
const messageController = require('./controller')

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

const acceptedTypes = ['video', 'image', 'audio']

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
}).array('attachment', 15)

const processAttachment = (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      res.send({error: true, message: 'File upload failed'})
    }
    else {
      next()
    }
  })
}

messageRouter.route('/message')
  .get(messageController.getMessage)
  .post(processAttachment, messageController.createMessage)

module.exports = messageRouter