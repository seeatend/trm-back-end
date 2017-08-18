const express = require('express')
const router = express.Router({mergeParams: true})
const handleUpload = require('utils/handleUpload')

const {applyController} = require('utils/api')
const HorseController = require('api/horse/controller')
const {authenticate} = require('utils/authentication')
const {assignQueryToBody} = require('utils/request')

router.route('/edit')
  .post(
    authenticate.is('admin'),
    handleUpload({
      fields: {
        featuredImage: {
          type: 'image'
        },
        thumbnailImage: {
          type: 'image'
        }
      },
      destination: 'horses'
    }),
    assignQueryToBody,
    applyController(HorseController.updateByName)
  )

module.exports = router