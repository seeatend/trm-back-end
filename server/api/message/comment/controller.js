const Comment = require('./model')
const {getUserDisplayName} = require('api/user/utils')

const createComment = (body, {user} = {}) => {
  const {messageId, text} = body
  const userId = user._id

  if (messageId && text && userId) {
    return Comment.create({
      messageId, text, userId
    })
  }
  else {
    return Promise.reject()
  }
}

const getComment = body => {
  const {messageId} = body

  if (messageId) {
    return Comment.find({
        messageId,
      },
      {_id: false, __v: false}
    ).lean().populate(
      'userId'
    ).then(comments => {
      return Promise.resolve(comments.map(comment => {
        comment.author = getUserDisplayName(comment.userId)
        delete comment.userId
        return comment
      }))
    })
  }
  else {
    return Promise.reject()
  }
}

module.exports = {
  createComment,
  getComment
}