const express = require('express')

const messageRouter = require('./message/routes')

const rootRouter = express.Router({mergeParams: true})

rootRouter.use(messageRouter)

module.exports = rootRouter