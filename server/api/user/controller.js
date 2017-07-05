const User = require('./model')

const getUser = ({filter = {__v: false, _id: false}, populate = true, omit}) => {
  let result = User.findOne(
    {name: 'demo'},
    filter
  )
  return populate ? result.populate('ownership.horse', omit) : result
}

const getShares = (query) => {
  if (query.horseId) {
    return getUser({
      filter: {ownership: true},
      populate: false
    }).then(user => {
      if (user && user.ownership) {
        let ownership = user.ownership.filter(elem => {
          return elem.horse.toString() === query.horseId.toString()
        })
        if (ownership.length > 0 && ownership[0]) {
          return Promise.resolve(ownership[0].shares)
        }
        return Promise.resolve()
      }
      return Promise.reject({message: 'Demo user not found'})
    })
  }
  else return Promise.reject({message: 'Query does not match'})
}

module.exports = {
  getUser,
  getShares
}