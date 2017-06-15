const Syndicate = require('./model')

exports.findBrutal = (name) => {
  return new Promise((resolve, reject) => {
    if (name) {
      Syndicate.findOne(
        {name}
      ).then(syndicate => {
        if (syndicate) {
          resolve(syndicate)
        }
        else {
          return Syndicate.create({name})
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
      reject({message: 'Syndicate name is not specified.'})
    }
  })
}