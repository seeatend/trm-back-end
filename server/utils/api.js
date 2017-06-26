const {success, error} = require('utils/request')

const applyController = (controller) => {
  return (req, res) => {
    let data = Object.keys(req.query).length > 0 ? req.query : req.body
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
}

module.exports = {
  applyController
}