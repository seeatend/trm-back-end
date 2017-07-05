require('setup')
const config = require('config')
const express = require('express')
const morgan = require('morgan')
const app = express()
const path = require('path')
const port = config.get('server.port')
const bodyParser = require('body-parser')
const compression = require('compression')
const passport = require('passport')
const {Strategy} = require('passport-local')

const routes = require('api')

app.use(compression())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use(morgan('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(require('cookie-parser')())
app.use(require('express-session')({
  secret: process.env.PASSPORT_SECRET,
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

// passport config
const User = require('api/user/model')
passport.use(new Strategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

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
