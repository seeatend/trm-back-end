const express = require('express')
const router = express.Router({mergeParams: true})

const {createComment, getComment} = require('./controller')
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')

router.route('/comment')
  .get(
    authenticate.read('message'),
    applyController(getComment)
  )
  .post(
    authenticate.write('message'),
    applyController(createComment)
  )

module.exports = router