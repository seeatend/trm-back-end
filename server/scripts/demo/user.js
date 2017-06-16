const {Horse} = require('api/horse/model')
const User = require('api/user/model')

module.exports = {
  register: () => {
    return Horse.find(
      {}
    ).limit(10).then(horses => {
      const ownership = []
      horses.forEach(horse => {
        ownership.push({
          horse: horse._id,
          shares: {
            owned: parseInt(Math.random() * 9) + 1,
            total: parseInt(Math.random() * 15) + 15
          }
        })
      })
      const user = {
        name: 'demo',
        type: 'member',
        ownership
      }
      return User.findOneAndUpdate(
        {name: user.name},
        user,
        {upsert: true, new: true}
      )
    })
  },

  get: () => {
    return User.findOne(
      {name: 'demo'}
    ).populate('ownership.horse')
  }
}

