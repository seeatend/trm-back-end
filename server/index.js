const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')

require('config/db')
require('models/message')

const routes = require('routes');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/uploads', express.static('uploads'))

app.use('/api/v1', routes)

app.use(function(req, res) {
  res.status(404).send({url: `${req.originalUrl} not found`})
})

app.listen(port)


console.log('TRM RESTful API server started on: ' + port)
