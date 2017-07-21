const {isFunction} = require('utils/object')

const success = data => {
  return {status: 'success', data}
}

const error = (message, errors) => {
  if (!message) message = 'Wrong parameters'
  return {status: 'error', message, errors}
}

const applyController = (controller, options) => {
  return (req, res) => {
    let data = Object.keys(req.query).length > 0 ? req.query : req.body
    if (isFunction(controller)) {
      controller(
        data,
        options
      ).then(result => {
        res.send(success(result))
      }).catch(err => {
        if (err && err.message) {
          let errors
          if (err.errors) {
            errors = {}
            Object.keys(err.errors).map(key => {
              let val = err.errors[key]
              errors[key] = [val.message]
            })
          }
          res.status(404).send(error(err.message, errors))
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
  applyController
}