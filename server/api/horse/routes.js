const express = require('express')

const router = express.Router({mergeParams: true})
const {getHorse} = require('./controller')
const {error, success} = require('utils/request')

router.route('/horse')
  .get((req, res) => {
    getHorse(
      req.query
    ).then(result => {
      res.send(success(result))
    }).catch(err => {
      console.log(err)
      res.status(404).send(error(err.message))
    })
  })

module.exports = router