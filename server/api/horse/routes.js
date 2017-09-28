const express = require('express')
require('./permissions')

const router = express.Router({mergeParams: true})
const HorseController = require('api/horse/controller')
const {applyController} = require('utils/api')
const handleUpload = require('utils/handleUpload')

const {authenticate} = require('utils/authentication')
const {assignQueryToBody, bodySelect, dotNotationToObject} = require('utils/request')

const routePath = '/horse'

router.route(routePath)
  .put(
    authenticate.can('put horse'),
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
    bodySelect([
      'horseName',
      'featuredImage',
      'thumbnailImage',
      'description',
      'style',
      'racingType',
      'cost.monthly',
      'cost.initial',
      'ownership.type',
      'ownership.years'
    ]),
    dotNotationToObject,
    applyController(HorseController.updateByName)
  )
  .get(
    applyController(HorseController.getHorse, {
      populate: {
        messages: true,
        shares: true
      }
    })
  )

module.exports = router
