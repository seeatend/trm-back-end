const Syndicate = require('./model')

const updateBrutal = (owner, data = {}) => {
  return new Promise((resolve, reject) => {
    if (owner) {
      Syndicate.findOne(
        {owner}
      ).then(syndicate => {
        if (syndicate) {
          if (Object.keys(data).length > 0) {
            return Object.assign(syndicate, data).save()
          }
          else {
            resolve(syndicate)
          }
        }
        else {
          return Syndicate.create(Object.assign({owner}, data))
        }
      }).then(syndicate => {
        if (syndicate) {
          resolve(syndicate)
        }
        else {
          reject({message: 'Could not create syndicate.'})
        }
      }).catch(err => {
        reject(err)
      })
    }
    else {
      reject({message: 'Syndicate owner is not specified.'})
    }
  })
}

module.exports = {
  updateBrutal
}