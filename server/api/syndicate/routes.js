const express = require('express')
const {success, error} = require('utils/request')

const router = express.Router({mergeParams: true})
const controller = require('./controller')

router.route('/syndicate')
  .get((req, res) => {
    controller.getSyndicate(
      req.query
    ).then(syndicate => {
      res.send(success(syndicate))
    }).catch(err => {
      res.status(404).send(error(err.message))
    })
  })

module.exports = router