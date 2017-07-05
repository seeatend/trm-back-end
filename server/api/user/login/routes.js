const express = require('express')
const router = express.Router({mergeParams: true})
const {loginUser} = require('./controller')

router.route('/login')
  .post(loginUser)

module.exports = router