const Comment = require('./model')
const {getUserDisplayName} = require('api/user/utils')
const {COMMENT} = require('data/messages')

const createComment = (body, {user} = {}) => {
  const {messageId, text} = body

  if (user && messageId && text) {
    const userId = user._id
    return Comment.create({
      messageId, text, userId
    }).then(() => {
      return Promise.resolve(COMMENT.SUCCESS)
    })
  } else {
    return Promise.reject()
  }
}

const getComment = body => {
  const {messageId} = body

  if (messageId) {
    return Comment.find({
      messageId
    },
    {_id: false, __v: false},
    {
      limit: 30,
      sort: {createdAt: -1}
    }
    ).lean().populate(
      'userId'
    ).then(comments => {
      return Promise.resolve(comments.map(comment => {
        comment.author = getUserDisplayName(comment.userId)
        delete comment.userId
        return comment
      }))
    })
  } else {
    return Promise.reject()
  }
}

module.exports = {
  createComment,
  getComment
}
