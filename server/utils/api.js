const {isFunction} = require('utils/object')
const {SUCCESS, ERROR} = require('data/statusCodes')

const success = data => {
  return {status: SUCCESS, data}
}

const error = ({message, errors, status} = {}) => {
  if (!message && !status) message = 'Wrong parameters'
  return {status: status || ERROR, message, errors}
}

const getReqBody = req => (Object.assign(req.body || {}, req.query || {}))

const applyController = (controller, options = {}) => {
  return (req, res) => {
    let data = getReqBody(req)
    global.devLog(data)
    options.user = req.user
    if (isFunction(controller)) {
      controller(
        data,
        options
      ).then(result => {
        res.send(success(result))
      }).catch(err => {
        if (err && (err.message || err.status)) {
          let errors
          if (err.errors) {
            errors = {}
            Object.keys(err.errors).map(key => {
              let val = err.errors[key]
              errors[key] = [val.message]
            })
          }
          console.log(err)
          res.status(404).send(error({
            message: err.message,
            errors,
            status: err.status
          }))
        }
        else
          res.status(404).send(error())
      })
    }
    else {
      console.error('Controller is not a function')
      res.status(404).send(error())
    }
  }
}

module.exports = {
  applyController,
  getReqBody,
  error,
  success
}