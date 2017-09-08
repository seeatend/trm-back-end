const {authenticate} = require('utils/authentication')
const {ownsHorseByHorseId, ownsHorseByMessageId} = require('api/horse/permissions')

authenticate.registerPermission('get message', ownsHorseByMessageId)
authenticate.registerPermission('post message', ownsHorseByHorseId)
