const express = require('express')
const router = express.Router({mergeParams: true})

const {createComment, getComment} = require('./controller')
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')

router.route('/comment')
  .get(
    authenticate,
    applyController(getComment)
  )
  .post(
    authenticate,
    applyController(createComment)
  )

module.exports = router