class Controller {
  constructor({schema, methods}) {
    this.schema = schema
    Object.assign(this, methods)
  }

  create(body) {
    this.schema.create(body)
  }

  find(query) {
    return this.schema.find(query)
  }

  findOne(query) {
    return this.schema.findOne(query)
  }

  findById(id) {
    return this.schema.findById(id)
      .then((doc) => {
        if (!doc) {
          return Promise.reject()
        }
        return Promise.resolve(doc)
      })
  }

  updateById({id, data}) {
    return this.schema.update({_id: id}, data)
      .then((results) => {
        if (results.n < 1) {
          return Promise.reject()
        }
        return Promise.resolve()
      })
  }

  removeById(id) {
    return this.schema.remove({_id: id})
      .then((doc) => {
        if (!doc) {
          return Promise.reject()
        }
        return Promise.resolve()
      })
  }

  removeAll() {
    return this.schema.remove()
  }
}

module.exports = {
  Controller
}
