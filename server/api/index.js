const express = require('express')

const messageRouter = require('./message/routes')
const horseRouter = require('./horse/routes')
const userRouter = require('./user/routes')

const rootRouter = express.Router({mergeParams: true})

rootRouter.use(messageRouter)
rootRouter.use(horseRouter)
rootRouter.use(userRouter)

module.exports = rootRouter