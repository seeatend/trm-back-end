var mongoose = require('mongoose'),
  Task = mongoose.model('Tasks')

exports.allTasks = function(req, res) {
  Task.find({}, function(err, task) {
    if (err)
      res.send(err)
    res.json(task)
  })
}

exports.createTask = function(req, res) {
  var newTask = new Task(req.body)
  newTask.save(function(err, task) {
    if (err)
      res.send(err)
    res.json(task)
  })
}