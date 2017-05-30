module.exports = function(app) {
  var todoList = require('controllers/todoList');

  // todoList Routes
  app.route('/tasks')
    .get(todoList.allTasks)
    .post(todoList.createTask)
}