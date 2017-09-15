const HorseController = require('api/horse/controller')
const SyndicateController = require('api/syndicate/controller')
const UserController = require('api/user/controller')

module.exports = {
  register: () => {
    let ownership = []
    return HorseController.find(
      {}
    ).then(horses => {
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
      return Promise.all(promises)
    })
      .then(() => {
        return SyndicateController.findOne({name: 'HIGHCLERE'})
      })
      .then(syndicate => {
        let user = {
          firstname: 'John',
          surname: 'Doe',
          password: '$2a$10$/q7.Fm.E3ZnvUtgcHKUiXuMMiE3bvURL/GiGhe0F2LTU6Mq6Dt7rm',
          email: 'demo@vitaminlondon.com',
          type: 'admin',
          syndicates: [syndicate._id],
          ownership
        }
        if (global.isLocal) {
          user._id = '59ba8724882f8bda956d968e'
        }
        return UserController.updateOrCreate({
          query: {firstname: user.firstname},
          data: user
        })
      })
  },

  get: () => {
    return UserController.findOne(
      {name: 'demo'}
    ).populate('ownership.horse')
  }
}
