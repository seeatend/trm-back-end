const {HorseModel} = require('api/horse/model')
const {prepareHorse} = require('api/horse/utils')

module.exports = (body = {}) => {
  let {amount} = body

  return HorseModel.aggregate(
    {$sample: {size: amount || 9}}
  ).then(horses => {
    if (horses) {
      let horseData = []
      horses.forEach(horse => {
        horseData.push(prepareHorse(horse))
      })
      return Promise.resolve(horseData)
    } else {
      return Promise.reject({message: 'Not found'})
    }
  })
}
