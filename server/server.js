const config = require('config')
const express = require('express')
const morgan = require('morgan')
const app = express()
const path = require('path')
const port = config.get('server.port')
const bodyParser = require('body-parser')
const compression = require('compression')

const routes = require('api')

app.use(compression())

if (isDev) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
    next()
  })
  app.use(morgan('dev'))
}


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(require('setup/passport')())

const storagePath = config.get('storage.path')
app.use(`/${storagePath}`, express.static(storagePath), (req, res) => {
  res.status(404).send('could not find the file')
})

app.use('/assets', express.static('public'))

app.use(`/api/v${config.get('api.version')}`, routes)

app.use('/api/*', (req, res) => {
  res.status(404).send({url: `${req.originalUrl} not found`})
})

app.use('/', express.static(path.resolve('./client')))

app.get('/*', (req, res) => {
  res.sendFile(path.resolve('./client/index.html'))
})

app.listen(port)


console.log('TRM RESTful API server started on: ' + port)