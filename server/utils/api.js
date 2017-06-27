const {success, error} = require('utils/request')
const {isFunction} = require('utils/object')

const applyController = (controller) => {
  return (req, res) => {
    let data = Object.keys(req.query).length > 0 ? req.query : req.body
    if (isFunction(controller)) {
      controller(
        data
      ).then(result => {
        res.send(success(result))
      }).catch(err => {
        if (err && err.message)
          res.status(404).send(error(err.message))
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