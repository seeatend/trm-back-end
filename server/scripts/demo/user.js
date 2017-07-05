const {Horse} = require('api/horse/model')
const User = require('api/user/model')

module.exports = {
  register: () => {
    return Horse.find(
      {}
    ).limit(10).then(horses => {
      let ownership = []
      let promises = []
      horses.forEach(horse => {
        let shares = {
          owned: parseInt(Math.random() * 9) + 1,
          total: parseInt(Math.random() * 15) + 15
        }
        ownership.push({
          horse: horse._id,
          shares
        })
        horse.shares = shares
        promises.push(horse.save())
      })
      let user = {
        name: 'demo',
        type: 'member',
        ownership
      }
      promises.push(User.findOneAndUpdate(
        {name: user.name},
        user,
        {upsert: true, new: true}
      ))
      return Promise.all(promises)
    })
  },

  get: () => {
    return User.findOne(
      {name: 'demo'}
    ).populate('ownership.horse')
  }
}

