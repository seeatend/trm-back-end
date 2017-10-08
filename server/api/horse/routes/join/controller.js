const { HorseModel } = require('api/horse/model')
const { sendMail } = require('utils/email')
const { METHODS, SYNDICATE } = require('data/messages')
const Syndicate = require('api/syndicate/model')

const joinHorse = (body, { user }) => {
  let { horseName } = body
  if (!horseName) {
    return Promise.reject({
      message: METHODS.MISSING_PARAMETER('horse name')
    })
  }

  let horse
  return HorseModel.findOne({ name: horseName }).then(_horse => {
    horse = _horse
    if (!horse) {
      return Promise.reject({ message: METHODS.HORSE.NOT_FOUND })
    }
    return Syndicate.findOne({ horses: horse._id })
  }).then(_syndicate => {
    if (!_syndicate) {
      return Promise.reject({ message: SYNDICATE.ERROR.NOT_FOUND })
    }
    let mailData = {
      from: `noreply@theracingmanager.com`,
      to: `info@theracingmanager.com`,
      subject: `The Racing Manager: Request to join a syndicate`,
      template: {
        name: 'joinHorse',
        data: {
          firstname: user.firstname,
          surname: user.surname,
          email: user.email,
          horse: horse.name,
          syndicate: _syndicate.name
        }
      }
    }
    sendMail(mailData)
    return Promise.resolve()
  })
}

module.exports = {
  joinHorse
}
