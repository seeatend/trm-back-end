const {METHODS} = require('data/messages')

const {Controller} = require('api/utils')
const UserModel = require('api/user/model')
const moment = require('moment')

const removeUser = (body = {}) => {
  return UserModel.remove(body)
}

const getUser = (body) => {
  return UserModel.findOne(
    body
  ).then(user => {
    if (user) return Promise.resolve(user)
    else {
      return Promise.reject({
        message: METHODS.USER.NOT_FOUND(body.email)
      })
    }
  })
}

const getShares = (query, {user} = {}) => {
  if (user && user.ownership) {
    let ownership = user.ownership.filter(elem => {
      return elem.horse.toString() === query.horseId.toString()
    })
    if (ownership.length > 0 && ownership[0]) {
      return Promise.resolve(ownership[0].shares)
    }
  }
  return Promise.resolve()
}

const updateUser = (body, {user}) => {
  if (body.birthDate) {
    body.birthDate = moment(body.birthDate, 'DD/MM/YYYY').toDate()
  }
  return Object.assign(
    user, body
  )
    .save()
    .then(() => Promise.resolve())
}

const UserController = new Controller({
  model: UserModel,
  methods: {
    removeUser,
    getUser,
    getShares,
    updateUser
  }
})

module.exports = UserController
