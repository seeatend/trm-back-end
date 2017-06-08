const config = require('config')
const express = require('express')
const morgan = require('morgan')
const app = express()
const path = require('path')
const port = config.get('server.port')
const bodyParser = require('body-parser')

require('setup/db')
require('models/message')

const routes = require('routes')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(`/${config.get('storage.path')}`, express.static('uploads'))

app.use(`/api/v${config.get('api.version')}`, routes)

app.use('/', express.static(path.resolve('./client')))

app.get('/*', (req, res) => {
  res.sendFile(path.resolve('./client/index.html'))
})


app.use(function(req, res) {
  res.status(404).send({url: `${req.originalUrl} not found`})
})


app.listen(port)


console.log('TRM RESTful API server started on: ' + port)
