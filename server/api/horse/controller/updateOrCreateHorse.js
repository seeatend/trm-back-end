const {HorseModel} = require('api/horse/model')

module.exports = (query, _data) => {
  let data = Object.assign({}, _data)

  return HorseModel.findOneAndUpdate(
    query,
    data,
    {
      upsert: true,
      new: true,
      runValidators: true
    }
  ).then(horse => {
    if (horse) {
      return Promise.resolve(horse)
    }
    else {
      return Promise.reject({message: 'Could not update horse.'})
    }
  }).catch(Promise.reject)
}
