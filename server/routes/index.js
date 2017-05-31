const express = require('express')

const messageRouter = require('./message')

const rootRouter = express.Router({mergeParams: true})

rootRouter.use(messageRouter)

module.exports = rootRouter