/**
 * Created by Ali on 06/09/2017.
 */

const express = require('express')
const router = express.Router({mergeParams: true})
const handleUpload = require('utils/handleUpload')

const {applyController} = require('utils/api')
const syndicateController = require('api/syndicate/controller')
const {authenticate} = require('utils/authentication')
const {assignQueryToBody, bodySelect} = require('utils/request')

router.route('/edit')
    .post(
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

module.exports = router
