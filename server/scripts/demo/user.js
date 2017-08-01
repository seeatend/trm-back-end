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
        firstname: 'John',
        surname: 'Doe',
        password: '$2a$10$/q7.Fm.E3ZnvUtgcHKUiXuMMiE3bvURL/GiGhe0F2LTU6Mq6Dt7rm',
        email: 'demo@vitaminlondon.com',
        type: 'member',
        ownership
      }
      promises.push(User.findOneAndUpdate(
        {firstname: user.firstname},
        user,
        {
          upsert: true
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

