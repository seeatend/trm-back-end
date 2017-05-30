const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')

require('config/db')
require('models/todoList')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var routes = require('routes')
routes(app)

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
})

app.listen(port)


console.log('todo list RESTful API server started on: ' + port)
