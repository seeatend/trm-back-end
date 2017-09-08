const {authenticate} = require('utils/authentication')
const {ownsHorseByMessageId} = require('api/horse/permissions')

authenticate.registerPermission('get comment', ownsHorseByMessageId)
authenticate.registerPermission('post comment', ownsHorseByMessageId)
