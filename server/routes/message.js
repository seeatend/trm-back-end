const express = require('express')

const multer = require('multer')

const path = require('path')

const {extension} = require('utils/file')

const mkdirp = require('mkdirp')


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let destination = path.resolve('./uploads/tmp')
    mkdirp(destination, cb.bind(this, null, destination))
  },
  filename: function(req, file, cb) {
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
    if (~acceptedTypes.indexOf(type)) {
      cb(null, true)
    }
    else {
      cb(null, false)
    }
  }
})

const messageRouter = express.Router({mergeParams: true})
const messageController = require('controllers/message');

messageRouter.route('/message')
  .get(messageController.getMessage)
  .post(upload.array('attachment', 15), messageController.createMessage)

module.exports = messageRouter