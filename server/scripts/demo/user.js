const {Horse} = require('api/horse/model')
const User = require('api/user/model')

module.exports = {
  register: () => {
    return Horse.find(
      {}
    ).then(horses => {
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
        firstname: 'demo',
        surname: 'demo',
        password: 'Demo123',
        type: 'member',
        ownership
      }
      promises.push(User.findOneAndUpdate(
        {firstname: user.firstname},
        user,
        {
          upsert: true,
          new: true,
          runValidators: true
        }
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

