require('./permissions')

const express = require('express')

const router = express.Router({mergeParams: true})

const handleUpload = require('utils/handleUpload')

const syndicateController = require('api/syndicate/controller')
const {authenticate} = require('utils/authentication')
const {assignQueryToBody, bodySelect} = require('utils/request')
const {applyController} = require('utils/api')

const routePath = '/syndicate'

router.route(routePath)
  .put(
    authenticate.is('admin'),
    handleUpload({
      fields: {
        featuredImage: {
          type: 'image'
        },
        logo: {
          type: 'image'
        }
      },
      destination: 'syndicate'
    }),
    assignQueryToBody,
    bodySelect([
      'syndicateName',
      'featuredImage',
      'description',
      'logo',
      'color'
    ]),
    applyController(syndicateController.updateByName)
  )
  .get(applyController(syndicateController.getSyndicate, {
    populate: {
      messages: true
    }
  }))

module.exports = router
