const mongoose = require('mongoose')
const {Horse} = require('./model')
const {prepareQuery, dehyphenize, success, error} = require('utils/request')

const availableQueries = ['name']

exports.getHorse = function (req, res) {
  let query = prepareQuery(req.query, availableQueries)
  if (query) {
    query.name = dehyphenize(query.name)
    Horse.findOne(
      query,
      {__v: false, _id: false},
      {
        limit: 20,
        sort: {createdAt: -1}
      }
    ).then(horse => {
      res.json(success(horse))
    }).catch(err => {
      res.send(error(err))
    })
  }
}