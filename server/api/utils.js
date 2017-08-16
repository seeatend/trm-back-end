class Controller {
  constructor({model, methods}) {
    this.model = model
    Object.assign(this, methods)
  }

  create(body) {
    return this.model.create(body)
  }

  find(query) {
    return this.model.find(query)
  }

  findOne(query) {
    return this.model.findOne(query)
  }

  findById(id) {
    return this.model.findById(id)
      .then((doc) => {
        if (!doc) {
          return Promise.reject()
        }
        return Promise.resolve(doc)
      })
  }

  updateById({id, data}) {
    return this.model.update({_id: id}, data)
      .then((results) => {
        if (results.n < 1) {
          return Promise.reject()
        }
        return Promise.resolve()
      })
  }

  removeById(id) {
    return this.model.remove({_id: id})
      .then((doc) => {
        if (!doc) {
          return Promise.reject()
        }
        return Promise.resolve()
      })
  }

  removeAll() {
    return this.model.remove()
  }
}

module.exports = {
  Controller
}
