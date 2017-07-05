const express = require('express')
const router = express.Router({mergeParams: true})

const {registerUser} = require('./controller')
const {loginUser} = require('api/user/login/controller')

router.route('/register')
  .post(registerUser, loginUser)

module.exports = router