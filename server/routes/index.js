module.exports = function(app) {
  var todoList = require('controllers/message');

  // todoList Routes
  app.route('/message')
    .get(todoList.allMessages)
    .post(todoList.createMessage)
}