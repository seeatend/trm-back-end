const Syndicate = require('api/syndicate/model')

const updateSyndicate = (_data = {}) => {
  let data = Object.assign({}, _data)

  data.name = data.owner ? data.name || data.owner.name : data.name

  if (!data.name) {
    return Promise.reject({message: 'Syndicate name is not specified.'})
  }
  else {
    data.name = data.name.toUpperCase()
    let query = {name: data.name}
    return Syndicate.findOne(query)
      .then(syndicate => {
        if (syndicate) {
          if (Object.keys(data).length > 0) {
            return Object.assign(syndicate, data).save()
          }
          else {
            return Promise.resolve(syndicate)
          }
        }
        else {
          return Syndicate.create(data)
        }
      }).then(syndicate => {
        if (syndicate) {
          return Promise.resolve(syndicate)
        }
        else {
          return Promise.reject({message: 'Could not create syndicate.'})
        }
      })
  }
}

module.exports = updateSyndicate